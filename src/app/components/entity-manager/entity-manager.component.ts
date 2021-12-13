import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditorListComponent } from 'src/app/components/editor-list/editor-list.component';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { EditorMode } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-entity-manager',
  templateUrl: './entity-manager.component.html',
  styleUrls: ['./entity-manager.component.css']
})
export class EntityManagerComponent implements OnInit {
  @ViewChild('treeComponent') treeComponent!: TreeComponent;
  @ViewChild('editorListComponent') editorListComponent!: EditorListComponent;

  treeEntities: string[] = [];
  editorMode: EditorMode = 'default';

  constructor(
    route: ActivatedRoute,
    public noteService: NoteService,
    private dialog: MatDialog,
    private promptService: PromptService,
  ) {
    this.editorMode = route.snapshot.data["editorMode"] ?? 'default';
  }

  ngOnInit(): void {
    this.getAndSetTreeEntities();
  }

  ngAfterViewInit() {
    const openedEditors = this.noteService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.editorListComponent.openEditor(editor.notePath, editor.minimized);
    }
  }

  //#region public methods
  async createNewItem() {
    await this.editorListComponent.createTopLevelEntity();
    this.refreshItems();
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

      this.refreshItems();
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
    this.refreshItems();

    if (deleteDescendants) {
      const descendants = this.noteService.getDescendantsRecursive(path);
      for (const descendant of descendants) {
        this.delete(descendant.path, false, false);
      }
    }
  }
  //#endregion

  //#region private methods
  private refreshItems() {
    this.getAndSetTreeEntities();
    this.treeComponent.refreshItems(this.treeEntities);
  }

  private getAndSetTreeEntities() {
    this.treeEntities = this.noteService.getAllPaths();
  }
  //#endregion
}
