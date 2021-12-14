import { Component, HostListener, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'src/app/modules/notes/models/editor';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { EditorComponent, EditorMode, MoveDirection } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit {
  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;
  
  editorMode: EditorMode = 'default';
  mode: EditorMode = 'default';
  editors: Editor[] = [];
  newOption = '+ Add New';

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private dialog: MatDialog,
    private promptService: PromptService,
    private zone: NgZone
  ) {
    this.editorMode = route.snapshot.data["editorMode"] ?? 'default';
  }

  //#region lifecycle events
  ngOnInit(): void {
    const openedEditors = this.noteService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.openEditor(editor.notePath, editor.minimized);
    }
  }

  ngAfterViewInit(): void { }
  //#endregion

  //#region host listener methods
  @HostListener('window:keydown.control.o', ['$event'])
  onOpenEditorShortcut(e: Event) {
    e.preventDefault();
    this.onOpenEditor();
  }
  //#endregion

  //#region events
  async onOpenEditor() {
    const noteNames = this.noteService.getAllPaths();
    const noteName = await this.promptService.openAutoCompletePrompt(this.dialog, "Open Note", "Note", noteNames);
    if(noteName) {
      if(!noteNames.includes(noteName)) {
        this.noteService.create(new Note(noteName, ''));
      }
      this.openEditor(noteName, false);
    }
  }

  onMoveEditor(id: string, direction: MoveDirection) {
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

  onEditorMinimized(editor: Editor, minimized: boolean) {
    this.refreshEditors();
    editor.minimized = minimized;
    this.noteService.updateOpenedEditor(editor);
  }

  onCloseEditor(id: string) {
    let editor = this.editors.find(x => x.id === id);
    if (editor) {
      this.editors = this.editors.filter(x => x.id !== id);
      this.noteService.removeOpenEditor(editor);
      if (this.editors.length > 0) {
        this.refreshEditors();
      }
    }
  }
  //#endregion

  //#region private methods
  private openEditor(noteId: string, minimized: boolean) {
    const newEditor = new Editor(uuidv4(), noteId, "markdown", minimized);
    this.editors.push(newEditor);
    this.noteService.addOpenedEditor(newEditor);
    this.refreshEditors();
  }

  private refreshEditors() {
    if(!this.editorComponents) {
      return;
    }
    
    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  //#endregion

  //#region unsorted
  async rename(oldPath: string, newPath: string = '') {
    const openedEditor = this.editorComponents.find(x => x.note.path === oldPath);

    if (!newPath) {
      const itemPathSegments = oldPath.split('/');
      const oldItemName = itemPathSegments[itemPathSegments.length - 1];
      const newItemName = await this.promptService.openInputPrompt(this.dialog, 'New Name', oldItemName);
      if (newItemName) {
        itemPathSegments[itemPathSegments.length - 1] = newItemName;
        newPath = itemPathSegments.join('/');
      } else {
        return;
      }
    }

    if (newPath) {
      if (openedEditor) {
        openedEditor.setName(newPath);
      }
      this.noteService.move(oldPath, newPath);

      const children = this.noteService.getDescendantsRecursive(oldPath);
      for (const child of children) {
        const newChildPath = child.path.replace(oldPath, newPath);
        this.rename(child.path, newChildPath)
      }
    }
  }

  delete(path: string, confirmDeletion: boolean = true, deleteDescendants: boolean = true) {
    if (confirmDeletion && !confirm(`Are you sure you want to delete ${path} and all its descendants?`)) {
      return;
    }

    const openedEditor = this.editorComponents.find(x => x.note.path === path);
    if (openedEditor) {
      openedEditor.closeEditor();
    }

    this.noteService.delete(path);

    if (deleteDescendants) {
      const descendants = this.noteService.getDescendantsRecursive(path);
      for (const descendant of descendants) {
        this.delete(descendant.path, false, false);
      }
    }
  }
  //#endregion
}
