import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { LineHandle } from 'codemirror';
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

  entity!: Entity;
  otherEntities: string[] = [];
  initialName: string = '';
  initialContent: string = '';

  //#region properties
  public get codeMirror(): CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }

  public get isDirty(): boolean {
    return this.entity.rawContent !== this.initialContent;
  }
  //#endregion

  constructor(
    public commandService: CommandService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  //#region lifecycle methods
  ngOnInit(): void {
    this.otherEntities = this.entityService.getAllPaths();
    this.getChronicle(this.name);
  }

  ngAfterViewInit() {
    this.registerCodeMirrorExtraKeys();
    if (this.codeMirror) {
      this.postProcessCodeMirror();
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
  public postProcessCodeMirror() {
    if (this.codeMirror) {
      const linesCount = this.codeMirror.lineCount();
      for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
        const line = this.codeMirror.getLine(lineIndex);
        const images = line.matchAll(/!\[.*\]\(.*\)/g);
        for (const image of images) {
          let imageUrl = image.toString().match(/\(.*\)/g)?.toString();
          if (imageUrl) {
            imageUrl = imageUrl.slice(1, imageUrl.length - 1);
            console.log(`Found image ${imageUrl} on line ${lineIndex}`);

            let widget: HTMLElement = this.renderer.createElement('img');
            this.renderer.setAttribute(widget, 'src', imageUrl);
            this.renderer.setStyle(widget, 'width', '100%');
            this.codeMirror.addLineWidget(lineIndex, widget);
          }
        }
      }
      this.codeMirror.refresh();
    }
  }
  
  closeEditor() {
    if (this.validateUnsavedChanges()) {
      this.onClosed.emit(true);
    }
  }

  setName(name: string) {
    this.entity.name = name;
  }

  changeChronicle(name: string) {
    if (this.validateUnsavedChanges()) {
      this.getChronicle(name);
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
  private getChronicle(name: string) {
    this.entity = this.entityService.get(name);
    this.initialContent = this.entity.rawContent;
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
