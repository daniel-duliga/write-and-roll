import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EditorListComponent } from 'src/app/components/editor-list/editor-list.component';
import { Entity } from 'src/app/entities/models/entity';
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
  async new() {
    await this.editorListComponent.createEntityAndOpenEditor();
    this.refreshEntities();
  }

  edit(path: string) {
    this.editorListComponent.openEditor(path);
  }

  async rename(path: string) {
    let entity: Entity | null = null;
    const openedEditor = this.editorListComponent.editorComponents.find(x => x.entity.name === path);
    if (openedEditor) {
      entity = openedEditor?.entity;
    } else {
      entity = this.entityService.get(path);
    }

    if (!entity) {
      return;
    }

    const initialName = entity.name;
    const nameSegments = entity.name.split('/');
    const newName = await this.promptService.openInputPrompt(this.dialog, 'New Name', nameSegments[nameSegments.length - 1]);
    if (newName) {
      nameSegments[nameSegments.length - 1] = newName;
      entity.name = nameSegments.join('/');
      if (openedEditor) {
        openedEditor.setName(entity.name);
        openedEditor.save();
      } else {
        this.entityService.create(entity.name, entity.rawContent);
      }
      this.entityService.delete(initialName);
      this.refreshEntities();
    }
  }

  delete(path: string) {
    const openedEditor = this.editorListComponent.editorComponents.find(x => x.entity.name === path);
    if (openedEditor) {
      openedEditor.closeEditor();
    }
    this.entityService.delete(path);
  }
  //#endregion

  //#region private methods
  private refreshEntities() {
    this.getAndSetTreeEntities();
    this.treeComponent.refreshItems(this.treeEntities);
  }

  private getAndSetTreeEntities() {
    this.treeEntities = this.entityService.getAll();
  }
  //#endregion
}
