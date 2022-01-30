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
  focusedEditor: EditorComponent | null = null;

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private zone: NgZone,
    private dialog: MatDialog,
    private promptService: PromptService,
    private noteManagerService: NoteManagerService
  ) {
    this.subscriptions.push(this.noteManagerService.openNoteRequests.subscribe(noteName => this.openNote(noteName)));
    this.subscriptions.push(this.noteManagerService.openNoteLinkRequests.subscribe(noteName => this.openLink(noteName)));
  }

  //#region lifecycle events
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
  //#endregion

  //#region host listener methods
  @HostListener('window:keydown.control.space', ['$event'])
  showCommands() {
    this.commands.showCommands();
  }
  //#endregion

  //#region events
  async openNote(noteName: string) {
    let openEditorIndex = this.editors.findIndex(x => x.notePath === noteName);
    if (openEditorIndex !== -1) {
      const editor = this.editors.splice(openEditorIndex, 1)[0];
      this.editors.push(editor);
    } else {
      const allNotes = this.noteService.getAll().sort((a,b) => a.compareTo(b));
      if (!allNotes.find(x => x.path === noteName)) {
        this.noteService.create(new Note(noteName, ''));
      }
      this.openEditor(noteName, false);
    }
  }

  closeEditor(id: string) {
    let editor = this.editors.find(x => x.id === id);
    if (editor) {
      this.editors = this.editors.filter(x => x.id !== id);
      this.noteManagerService.removeOpenEditor(editor);
      if (this.editors.length > 0) {
        this.refreshEditors();
      }
    }
  }

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

  async renameNote(editor: Editor) {
    const oldName = editor.notePath;
    const newName = await this.promptService.input(this.dialog, 'New Name', oldName);
    if (newName) {
      this.noteService.rename(oldName, newName);
      const editorComponent = this.editorComponents.find(x => x.note.path === oldName);
      if (editorComponent) {
        editorComponent.setName(newName);

        this.noteManagerService.removeOpenEditor(editor);
        editor.notePath = newName;
        this.noteManagerService.addOpenedEditor(editor);
      }
    }
  }

  deleteNote(editor: Editor) {
    if (!confirm(`Are you sure you want to delete ${editor.notePath}?`)) {
      return;
    }

    this.noteService.delete(editor.notePath);
    this.closeEditor(editor.id);
  }

  toggleEditorMinimized(editor: Editor, minimized: boolean) {
    this.refreshEditors();
    editor.minimized = minimized;
    this.noteManagerService.updateOpenedEditor(editor);
  }

  openLink(address: string) {
    this.zone.run(() => this.openEditor(address, false));
  }

  handleCommandResult(result: string) {
    if(this.focusedEditor) {
      this.focusedEditor.replaceSelection(result);
    }
  }

  setFocusedEditor(editor: EditorComponent) {
    this.focusedEditor = editor;
  }
  //#endregion

  //#region private methods
  private refreshEditors() {
    if (!this.editorComponents) {
      return;
    }

    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }

  private openEditor(noteId: string, minimized: boolean) {
    const newEditor = new Editor(uuidv4(), noteId, minimized);
    this.editors.push(newEditor);
    this.noteManagerService.addOpenedEditor(newEditor);
    this.refreshEditors();
  }
  //#endregion
}
