import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { CommandService } from 'src/app/commands/command.service';
import { ChronicleStorageService } from 'src/app/storage/model-services/chronicle-storage.service';
import { Chronicle } from 'src/app/storage/models/chronicle';
import { AutoCompleteFieldComponent } from '../fields/auto-complete-field/auto-complete-field.component';

@Component({
  selector: 'app-chronicle-editor',
  templateUrl: './chronicle-editor.component.html',
  styleUrls: ['./chronicle-editor.component.css']
})
export class ChronicleEditorComponent implements OnInit {
  @Input() chronicleName: string = '';

  @Output() onChanged: EventEmitter<string> = new EventEmitter();
  @Output() onClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() onNew: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;
  @ViewChild('commands') commands!: AutoCompleteFieldComponent;

  chronicle: Chronicle = new Chronicle();
  allChronicles: string[] = [];
  initialName: string = '';
  initialContent: string = '';

  public get codeMirror(): CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }

  public get isDirty(): boolean {
    return this.chronicle.rawContent !== this.initialContent;
  }

  constructor(
    public commandService: CommandService,
    public dialog: MatDialog,
    private chronicleStorageService: ChronicleStorageService,
    private snackBar: MatSnackBar,
  ) { }

  //#region lifecycle methods
  ngOnInit(): void {
    this.allChronicles = this.chronicleStorageService.getAllPaths();
    this.getChronicle(this.chronicleName);
  }
  ngAfterViewInit() {
    this.registerCodeMirrorExtraKeys();
    if (this.codeMirror) {
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

  closeEditor() {
    if (this.validateUnsavedChanges()) {
      this.onClosed.emit(true);
    }
  }
  
  setName(name: string) {
    this.chronicle.name = name;
  }

  changeChronicle(name: string) {
    if (this.validateUnsavedChanges()) {
      this.getChronicle(name);
      this.onChanged.emit(name);
    }
  }

  save($event: Event | null = null) {
    // If triggered by key combination, prevent default browser save action
    if ($event) {
      $event.preventDefault();
    }

    // Validation
    let errors = '';

    if (this.chronicle.name.trim() === '') {
      errors += 'Name is required.\n';
    } else if (this.chronicle.name.trim().endsWith('/')) {
      errors += 'Name cannot end with "/".\n';
    }

    if (errors !== '') {
      alert(errors);
      return;
    }

    // Save
    if (this.initialName) {
      this.chronicleStorageService.delete(this.initialName);
    }

    this.chronicleStorageService.create(this.chronicle.name, this.chronicle.rawContent);

    this.initialContent = this.chronicle.rawContent;
  }

  openNewEditor() {
    this.onNew.emit(true);
  }
  //#endregion

  //#region private methods
  private getChronicle(name: string) {
    this.chronicle = this.chronicleStorageService.get(name);
    this.initialContent = this.chronicle.rawContent;
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
