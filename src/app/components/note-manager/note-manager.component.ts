import { Component, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'src/app/modules/notes/models/editor';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { EditorComponent } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';
import { v4 as uuidv4 } from 'uuid';
import { NoteManagerService } from './note-manager.service';
import { Subscription } from 'rxjs';
import { CommandsComponent } from '../commands/commands.component';

@Component({
  selector: 'app-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit, OnDestroy {
  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;
  @ViewChild('commands') commands!: CommandsComponent;

  editors: Editor[] = [];
  newOption = '+ Add New';
  subscriptions: Subscription[] = [];
  showAttributes = false;
  focusedEditor: EditorComponent | null = null;

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private zone: NgZone,
    private dialog: MatDialog,
    private promptService: PromptService,
    private noteManagerService: NoteManagerService
  ) {
    this.subscriptions.push(this.noteManagerService.requestOpen.subscribe(notePath => this.openNote(notePath)));
    this.subscriptions.push(this.noteManagerService.requestClose.subscribe(_ => this.closeFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestRename.subscribe(_ => this.renameFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestFavorite.subscribe(_ => this.favoriteFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestDelete.subscribe(_ => this.deleteFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestOpenLink.subscribe(notePath => this.openLink(notePath)));
  }

  // lifecycle events
  ngOnInit(): void {
    const openedEditors = this.noteManagerService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.openEditor(editor.notePath, editor.minimized);
    }
  }
  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // host listener methods
  @HostListener('window:keydown.control.space', ['$event'])
  showCommands() {
    this.commands.showCommands();
  }

  // commands
  handleCommandResult(result: string) {
    if (this.focusedEditor) {
      this.focusedEditor.replaceSelection(result);
    }
  }
  async openNote(notePath: string) {
    let openEditorIndex = this.editors.findIndex(x => x.notePath === notePath);
    if (openEditorIndex !== -1) {
      const editor = this.editors.splice(openEditorIndex, 1)[0];
      this.editors.push(editor);
    } else {
      const allNotes = this.noteService.getAll().sort((a, b) => a.compareTo(b));
      if (!allNotes.find(x => x.path === notePath)) {
        this.noteService.create(new Note(notePath, ''));
      }
      this.openEditor(notePath, false);
    }
  }
  closeFocusedNote() {
    if (!this.focusedEditor) { return; }

    const notePath = this.focusedEditor.notePath;

    let editor = this.editors.find(x => x.notePath === notePath);
    if (!editor) { return; }

    let editorComponent = this.editorComponents.find(x => x.notePath === notePath);
    if (!editorComponent) { return; }

    if (editorComponent.isDirty && !confirm("Are you sure? Changes you made will not be saved.")) {
      return;
    }

    this.editors = this.editors.filter(x => x.id !== editor?.id);
    this.noteManagerService.removeOpenEditor(editor);
    if (this.editors.length > 0) {
      this.refreshEditors();
    }
  }
  async renameFocusedNote() {
    if (!this.focusedEditor) { return; }

    const editor = this.editors.find(x => x.notePath === this.focusedEditor?.notePath);
    if (!editor) { return; }

    const oldName = this.focusedEditor.notePath;
    const newName = await this.promptService.input(this.dialog, 'New Name', oldName);
    if (newName) {
      this.noteService.rename(oldName, newName);
      
      this.focusedEditor.setName(newName);
      this.focusedEditor.notePath = newName;
      
      this.noteManagerService.removeOpenEditor(editor);
      editor.notePath = newName;
      this.noteManagerService.addOpenedEditor(editor);
    }
  }
  favoriteFocusedNote() {
    if (!this.focusedEditor) { return; }

    this.focusedEditor.note.favorite = !this.focusedEditor.note.favorite;
    this.focusedEditor.save();
  }
  deleteFocusedNote() {
    if (!this.focusedEditor) { return; }

    if (!confirm(`Are you sure you want to delete ${this.focusedEditor.notePath}?`)) {
      return;
    }

    this.noteService.delete(this.focusedEditor.notePath);
    this.closeFocusedNote();
  }
  openLink(address: string) {
    this.zone.run(() => this.openEditor(address, false));
  }

  // editor management
  moveEditor(id: string, direction: "left" | "right") {
    const editorIndex = this.editors.findIndex(x => x.id === id);
    if (editorIndex !== -1) {
      const editor = this.editors[editorIndex];
      if (direction === "left" && editorIndex !== 0) {
        this.editors.splice(editorIndex, 1);
        this.editors.splice(editorIndex - 1, 0, editor);
      } else if (direction === "right" && editorIndex !== this.editors.length - 1) {
        this.editors.splice(editorIndex, 1);
        this.editors.splice(editorIndex + 1, 0, editor);
      }
    }
  }
  toggleEditorMinimized(editor: Editor, minimized: boolean) {
    this.refreshEditors();
    editor.minimized = minimized;
    this.noteManagerService.updateOpenedEditor(editor);
  }
  setFocusedEditor(editor: EditorComponent) {
    this.focusedEditor = editor;
  }

  // private methods
  private refreshEditors() {
    if (!this.editorComponents) {
      return;
    }

    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  private openEditor(noteId: string, minimized: boolean) {
    const newEditor = new Editor(uuidv4(), noteId, minimized, false);
    this.editors.push(newEditor);
    this.noteManagerService.addOpenedEditor(newEditor);
    this.refreshEditors();
  }
}
