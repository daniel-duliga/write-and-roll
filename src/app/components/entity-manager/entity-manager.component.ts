import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditorListComponent } from 'src/app/components/editor-list/editor-list.component';
import { Item } from 'src/app/entities/models/item';
import { EntityService } from 'src/app/entities/services/entity.service';
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

  public entityService!: EntityService;
  treeEntities: string[] = [];
  editorMode: EditorMode = 'default';

  constructor(
    route: ActivatedRoute,
    injector: Injector,
    private dialog: MatDialog,
    private promptService: PromptService,
  ) {
    const entityServiceToken = route.snapshot.data["entityServiceToken"];
    this.editorMode = route.snapshot.data["editorMode"] ?? 'default';
    this.entityService = injector.get<EntityService>(entityServiceToken);
  }

  ngOnInit(): void {
    this.getAndSetTreeEntities();
  }

  ngAfterViewInit() {
    const openedEditors = this.entityService.getOpenedEditors();
    for (const editor of openedEditors) {
      this.editorListComponent.openEditor(editor.entityId, editor.minimized);
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
    const openedEditor = this.editorListComponent.editorComponents.find(x => x.entity.path === oldPath);

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
      this.entityService.move(oldPath, newPath);

      const children = this.entityService.getDescendantsRecursive(oldPath);
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

    const openedEditor = this.editorListComponent.editorComponents.find(x => x.entity.path === path);
    if (openedEditor) {
      openedEditor.closeEditor();
    }

    this.entityService.delete(path);
    this.refreshItems();

    if (deleteDescendants) {
      const descendants = this.entityService.getDescendantsRecursive(path);
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
    this.treeEntities = this.entityService.getAll();
  }
  //#endregion
}
