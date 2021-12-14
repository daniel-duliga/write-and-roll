import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditorListComponent } from 'src/app/components/editor-list/editor-list.component';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { EditorMode } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';

@Component({
  selector: 'app-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit {
  @ViewChild('editorListComponent') editorListComponent!: EditorListComponent;
  editorMode: EditorMode = 'default';

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private dialog: MatDialog,
    private promptService: PromptService,
  ) {
    this.editorMode = route.snapshot.data["editorMode"] ?? 'default';
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    const openedEditors = this.noteService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.editorListComponent.openEditor(editor.notePath, editor.minimized);
    }
  }

  //#region public methods
  async createNewItem() {
    await this.editorListComponent.createTopLevelNote();
  }

  edit(path: string) {
    this.editorListComponent.openEditor(path);
  }

  async rename(oldPath: string, newPath: string = '') {
    const openedEditor = this.editorListComponent.editorComponents.find(x => x.note.path === oldPath);

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

    const openedEditor = this.editorListComponent.editorComponents.find(x => x.note.path === path);
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
