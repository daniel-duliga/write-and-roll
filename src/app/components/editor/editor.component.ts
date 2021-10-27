import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { LineHandle, LineWidget } from 'codemirror';
import { CommandService } from 'src/app/commands/command.service';
import { Entity } from 'src/app/entities/models/entity';
import { EntityService } from 'src/app/entities/services/entity.service';
import { AutoCompleteFieldComponent } from '../fields/auto-complete-field/auto-complete-field.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() name: string = '';
  @Input() mode: string = '';
  @Input() entityService!: EntityService;
  @Input() showNewButton: boolean = true;
  @Input() showCommandsSection: boolean = true;

  @Output() onChanged: EventEmitter<string> = new EventEmitter();
  @Output() onClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() onNew: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;
  @ViewChild('commands') commands!: AutoCompleteFieldComponent;

  entity: Entity = { name: '', rawContent: '', validate: () => '' };
  otherEntities: string[] = [];
  initialName: string = '';
  initialContent: string = '';
  lineWidgets: LineWidget[] = [];
  search = true;

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
    public commandService: CommandService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  //#region lifecycle methods
  ngOnInit(): void {
    this.otherEntities = this.entityService.getAllPaths(true);
    this.getAndSetChronicle(this.name);
    this.automaticToggleSearchMode();
  }

  ngAfterViewInit() {
    this.registerCodeMirrorExtraKeys();
    if (this.codeMirror) {
      this.codeMirror.on('changes', () => this.postProcessCodeMirror());
      this.codeMirror.focus();
    }
  }
  //#endregion

  //#region host listener methods
  @HostListener('keydown.control.space', ['$event'])
  async onShowCommands(e: Event) {
    this.commands.autocompleteInput.nativeElement.focus();
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

  //#region public methods
  postProcessCodeMirror() {
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

  closeEditor() {
    if (this.validateUnsavedChanges()) {
      this.onClosed.emit(true);
    }
  }

  toggleSearch() {
    this.search = !this.search;
  }

  changeEntityName(name: string) {
    this.entity.name = name;
  }

  changeEntity(name: string) {
    if (this.validateUnsavedChanges()) {
      this.getAndSetChronicle(name);
      this.automaticToggleSearchMode();
      this.onChanged.emit(name);
    }
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
    if (this.initialName) {
      this.entityService.delete(this.initialName);
    }

    this.entityService.create(this.entity.name, this.entity.rawContent);

    this.initialContent = this.entity.rawContent;

    this.otherEntities = this.entityService.getAllPaths(true);
  }

  async showCommands(command: string) {
    const result = await this.commandService.handleCommandSelected(this.dialog, command);
    this.handleCommand(result);
    this.commands.autocompleteTrigger.closePanel();
  }

  handleCommand(option: string) {
    if (option && this.codeMirror) {
      this.codeMirror.replaceSelection(`\`${option}\``);
      this.codeMirror.focus();
    }
  }
  //#endregion

  //#region private methods
  private getAndSetChronicle(name: string) {
    this.entity = this.entityService.get(name);
    this.initialContent = this.entity.rawContent;
  }
  private automaticToggleSearchMode() {
    this.search = this.name === '' || this.name.endsWith('/');
  }
  private registerCodeMirrorExtraKeys() {
    if (this.codeMirror) {
      this.codeMirror.setOption(
        "extraKeys", {
        Enter: function (cm) {
          cm.execCommand("newlineAndIndentContinueMarkdownList");
        }
      });
    }
  }
  private validateUnsavedChanges() {
    return !this.isDirty || confirm("Are you sure? Changes you made will not be saved.");
  }
  //#endregion
}
