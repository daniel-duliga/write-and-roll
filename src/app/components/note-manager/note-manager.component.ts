import { Component, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'src/app/modules/notes/models/editor';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { EditorComponent, EditorMode, MoveDirection } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';
import { v4 as uuidv4 } from 'uuid';
import { NoteManagerService } from './note-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit, OnDestroy {
  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;

  editorMode: EditorMode = 'default';
  mode: EditorMode = 'default';
  editors: Editor[] = [];
  newOption = '+ Add New';
  subscriptions: Subscription[] = [];

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private zone: NgZone,
    private dialog: MatDialog,
    private promptService: PromptService,
    private noteManagerService: NoteManagerService
  ) {
    this.editorMode = route.snapshot.data["editorMode"] ?? 'default';
    this.subscriptions.push(
      this.noteManagerService.openNotes.subscribe(noteName => this.openLink(noteName)));
  }

  //#region lifecycle events
  ngOnInit(): void {
    const openedEditors = this.noteService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.openEditor(editor.notePath, editor.minimized);
    }
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  //#endregion

  //#region host listener methods
  @HostListener('window:keydown.control.o', ['$event'])
  onOpenNoteShortcut(e: Event) {
    e.preventDefault();
    this.openNote();
  }
  //#endregion

  //#region events
  async openNote() {
    const noteNames = this.noteService.getAllPaths();
    const noteName = await this.promptService.openAutoCompletePrompt(this.dialog, "Open Note", "Note", noteNames);
    if (noteName) {
      if (!noteNames.includes(noteName)) {
        this.noteService.create(new Note(noteName, ''));
      }
      this.openEditor(noteName, false);
    }
  }

  closeEditor(id: string) {
    let editor = this.editors.find(x => x.id === id);
    if (editor) {
      this.editors = this.editors.filter(x => x.id !== id);
      this.noteService.removeOpenEditor(editor);
      if (this.editors.length > 0) {
        this.refreshEditors();
      }
    }
  }

  moveEditor(id: string, direction: MoveDirection) {
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
    const newName = await this.promptService.openInputPrompt(this.dialog, 'New Name', oldName);
    if (newName) {
      this.noteService.rename(oldName, newName);
      const editorComponent = this.editorComponents.find(x => x.note.path === oldName);
      if (editorComponent) {
        editorComponent.setName(newName);

        this.noteService.removeOpenEditor(editor);
        editor.notePath = newName;
        this.noteService.addOpenedEditor(editor);
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
    this.noteService.updateOpenedEditor(editor);
  }

  openLink(address: string) {
    this.zone.run(() => this.openEditor(address, false));
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
    const newEditor = new Editor(uuidv4(), noteId, "markdown", minimized);
    this.editors.push(newEditor);
    this.noteService.addOpenedEditor(newEditor);
    this.refreshEditors();
  }
  //#endregion
}
