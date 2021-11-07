import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, EditorMode, MoveDirection } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';
import { PromptService } from 'src/app/components/prompts/prompt.service';
import { MatDialog } from '@angular/material/dialog';
import { Editor } from 'src/app/components/editor/editor';
import { EntityService } from 'src/app/entities/services/entity.service';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.component.html',
  styleUrls: ['./editor-list.component.css']
})
export class EditorListComponent implements OnInit {
  @Input() entityName: string | null = null;
  @Input() mode: EditorMode = 'default';
  @Input() entityService!: EntityService;

  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;

  editors: Editor[] = [];
  newOption = '+ Add New';

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() { }

  //#region public methods
  openEditor(entityName: string) {
    this.openEditorForExistingEntity(entityName);
  }

  public async createEntityAndOpenEditor(): Promise<Editor | null> {
    const entityPath = await this.createNewEntity();
    if (!entityPath) {
      return null;
    } else {
      return this.openEditorForExistingEntity(entityPath);
    }
  }

  closeEditor(id: string) {
    let editor = this.editors.find(x => x.id === id);
    if (editor) {
      this.editors = this.editors.filter(x => x.id !== id);
      this.entityService.removeOpenEntity(editor.entityId);
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

  refreshEditors() {
    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  //#endregion

  //#region private methods
  private openEditorForExistingEntity(entityPath: string) {
    const newEditor = new Editor(uuidv4(), entityPath);
    this.editors.push(newEditor);
    this.entityService.addOpenedEntity(entityPath);
    this.refreshEditors();
    return newEditor;
  }

  private async createNewEntity(): Promise<string | null> {
    const allFolders = this.entityService.getAllParents();
    const folders = allFolders;
    folders.push(this.newOption);

    let targetFolder = await this.promptService.openAutoCompletePrompt(this.dialog, 'Folder', folders);
    if (!targetFolder) {
      return null;
    } else if (targetFolder === this.newOption) {
      const parentFolder = await this.promptService.openAutoCompletePrompt(this.dialog, 'Parent Folder', allFolders);
      targetFolder = await this.promptService.openInputPrompt(this.dialog, 'New Folder Name');
      if (!targetFolder) {
        return null;
      }
      targetFolder = `${parentFolder}${targetFolder}/`;
    }

    const newName = await this.promptService.openInputPrompt(this.dialog, 'New Name');
    if (!newName) {
      return null;
    }

    const path = `${targetFolder}${newName}`;

    const existingEntity = this.entityService.get(path);
    if (existingEntity) {
      alert(`Entity '${path}' already exists.'`);
      return null;
    }

    this.entityService.create(path, '');
    return path;
  }
  //#endregion
}
