import { Component, Input, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EditorComponent, EditorMode, MoveDirection } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';
import { PromptService } from 'src/app/components/prompts/prompt.service';
import { MatDialog } from '@angular/material/dialog';
import { EditorListService } from 'src/app/components/editor-list/editor-list.service';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { Editor } from 'src/app/modules/notes/models/editor';
import { Note } from 'src/app/modules/notes/models/note';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.component.html',
  styleUrls: ['./editor-list.component.css']
})
export class EditorListComponent implements OnInit {
  @Input() noteName: string | null = null;
  @Input() mode: EditorMode = 'default';

  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;

  editors: Editor[] = [];
  newOption = '+ Add New';

  constructor(
    private noteService: NoteService,
    private promptService: PromptService,
    private dialog: MatDialog,
    private editorListService: EditorListService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.editorListService.onEditorOpened.subscribe(notePath => {
      this.ngZone.run(() => this.openEditor(notePath, false));
    })
  }

  //#region public methods
  openEditor(notePath: string, minimized = false) {
    this.openEditorForExistingNote(notePath, minimized);
  }

  public async createTopLevelNote(): Promise<Editor | null> {
    const notePath = await this.createNewItem();
    if (!notePath) {
      return null;
    } else {
      return this.openEditorForExistingNote(notePath, false);
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

  editorMinimized(editor: Editor, minimized: boolean) {
    this.refreshEditors();
    editor.minimized = minimized;
    this.noteService.updateOpenedEditor(editor);
  }

  refreshEditors() {
    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  //#endregion

  //#region private methods
  private openEditorForExistingNote(noteId: string, minimized: boolean) {
    const newEditor = new Editor(uuidv4(), noteId, minimized);
    this.editors.push(newEditor);
    this.noteService.addOpenedEditor(newEditor);
    this.refreshEditors();
    return newEditor;
  }

  private async createNewItem(parentPath: string = ''): Promise<string | null> {
    const name = await this.promptService.openInputPrompt(this.dialog, 'Name');
    if (!name) {
      return null;
    }

    const notePath = `${parentPath}${name}`;

    const existingNote = this.noteService.get(notePath);
    if (existingNote) {
      alert(`Item '${notePath}' already exists.'`);
      return null;
    }

    this.noteService.create(new Note(notePath, ''));
    return notePath;
  }
  //#endregion
}
