import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { LineWidget } from 'codemirror';
import { Entity } from 'src/app/entities/models/entity';
import { EntityService } from 'src/app/entities/services/entity.service';
import { CommandsComponent } from '../commands/commands.component';

export type MoveDirection = "left" | "right";
export type EditorMode = "markdown" | "javascript" | "default";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() name: string = '';
  @Input() mode: EditorMode = "default";
  @Input() entityService!: EntityService;

  @Output() onChanged: EventEmitter<string> = new EventEmitter();
  @Output() onClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() onNew: EventEmitter<boolean> = new EventEmitter();
  @Output() onMove: EventEmitter<MoveDirection> = new EventEmitter();

  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;
  @ViewChild('commands') commands!: CommandsComponent;

  entity: Entity = { name: '', rawContent: '', validate: () => '' };
  initialContent: string = '';
  lineWidgets: LineWidget[] = [];
  minimized = false;

  //#region properties
  public get codeMirror(): CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }
  public get isDirty(): boolean {
    return this.entity.rawContent !== this.initialContent;
  }
  public get formattedName(): string {
    const nameSegments = this.entity.name.split('/');
    return nameSegments[nameSegments.length - 1];
  }
  //#endregion

  constructor(
    private renderer: Renderer2
  ) { }

  //#region lifecycle events
  ngOnInit(): void {
    this.getAndSetEntity(this.name);
  }

  ngAfterViewInit() {
    this.configureCodeMirror();
    this.refresh();
  }
  //#endregion

  //#region host listener methods
  @HostListener('keydown.control.space', ['$event'])
  async onShowCommands(e: Event) {
    this.commands.focus();
  }

  @HostListener('keydown.control.s', ['$event'])
  onSave(e: Event) {
    this.save(e);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: Event): boolean | undefined {
    return !this.isDirty;
  }
  //#endregion

  //#region header buttons event handlers
  closeEditor() {
    if (this.validateUnsavedChanges()) {
      this.onClosed.emit(true);
    }
  }

  minimize() {
    this.minimized = true;
  }

  maximize() {
    this.minimized = false;
  }

  move(direction: MoveDirection) {
    this.onMove.emit(direction);
  }

  openNewEditor() {
    this.onNew.emit(true);
  }

  save($event: Event | null = null) {
    // If triggered by key combination, prevent default browser save action
    if ($event) {
      $event.preventDefault();
    }

    // Validation
    const errors = this.entity.validate();
    if (errors !== '') {
      alert(errors);
      return;
    }

    // Save
    const newEntity = this.entityService.create(this.entity.name, this.entity.rawContent);

    // Reflect saved data
    this.initialContent = this.entity.rawContent;
  }
  //#endregion

  //#region public methods
  refresh() {
    setTimeout(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
      }
    }, 250);
  }

  changeEntity(name: string) {
    if (this.validateUnsavedChanges()) {
      this.getAndSetEntity(name);
      this.onChanged.emit(name);
    }
  }

  handleCommand(option: string) {
    if (option && this.codeMirror) {
      this.codeMirror.replaceSelection(`\`${option}\``);
      this.codeMirror.focus();
    }
  }
  //#endregion

  //#region private methods
  private postProcessCodeMirror() {
    if (this.mode !== 'markdown') {
      return;
    }

    if (this.codeMirror) {
      const y = this.codeMirror.getScrollInfo().top;

      for (const lineWidget of this.lineWidgets) {
        lineWidget.clear();
      }
      this.lineWidgets = [];

      const linesCount = this.codeMirror.lineCount();
      for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
        const line = this.codeMirror.getLine(lineIndex);
        const images = line.matchAll(/!\[.*\]\(.*\)/g);
        for (const image of images) {
          let imageUrl = image.toString().match(/\(.*\)/g)?.toString();
          if (imageUrl) {
            imageUrl = imageUrl.slice(1, imageUrl.length - 1);

            let widget: HTMLElement = this.renderer.createElement('img');
            this.renderer.setAttribute(widget, 'src', imageUrl);
            this.renderer.setStyle(widget, 'max-width', '100%');

            const lineWidget = this.codeMirror.addLineWidget(lineIndex, widget);

            this.lineWidgets.push(lineWidget);
          }
        }
      }

      this.codeMirror.scrollTo(null, y);
    }
  }

  private getAndSetEntity(name: string) {
    const newEntity = this.entityService.get(name);
    if (newEntity) {
      this.entity = newEntity;
      this.initialContent = this.entity.rawContent;
      this.name = name;
      this.entity.name = name;
    }
  }

  private configureCodeMirror() {
    if (this.codeMirror) {
      this.codeMirror.setOption("extraKeys", {
        Enter: function (cm) {
          cm.execCommand("newlineAndIndentContinueMarkdownList");
        }
      });

      this.codeMirror.on('changes', () => this.postProcessCodeMirror());

      this.codeMirror.focus();
    }
  }

  private validateUnsavedChanges() {
    return !this.isDirty || confirm("Are you sure? Changes you made will not be saved.");
  }
  //#endregion
}
