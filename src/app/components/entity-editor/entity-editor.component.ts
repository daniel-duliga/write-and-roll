import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, EditorMode, MoveDirection } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';
import { PromptService } from 'src/app/components/prompts/prompt.service';
import { MatDialog } from '@angular/material/dialog';
import { Editor } from 'src/app/components/editor/editor';
import { EntityService } from 'src/app/entities/services/entity.service';

@Component({
  selector: 'app-entity-editor',
  templateUrl: './entity-editor.component.html',
  styleUrls: ['./entity-editor.component.css']
})
export class EntityEditorComponent implements OnInit {
  @Input() mode: EditorMode = 'default';
  @Input() entityService!: EntityService;

  @Output() onClosed: EventEmitter<void> = new EventEmitter();

  @ViewChildren('editor') editorComponents!: QueryList<EditorComponent>;

  editors: Editor[] = [];
  newOption = '> Add New';

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
  }

  //#region public methods
  async openNewEditor(currentEditorId: string | null = null): Promise<Editor | null> {
    // Load the current entities
    const entities = this.entityService.getAll(false);
    entities.push(this.newOption);

    // Get the target entity
    let entityPath: string | null = await this.promptService.openAutoCompletePrompt(this.dialog, "Target", entities);
    if (!entityPath) {
      return null;
    } else if (entityPath === this.newOption) {
      return this.createEntityAndAddEditor(currentEditorId);
    } else {
      return this.addEditorForExistingEntity(currentEditorId, entityPath);
    }
  }

  closeEditor(id: string) {
    this.editors = this.editors.filter(x => x.id !== id);
    if (this.editors.length === 0) {
      this.onClosed.emit();
    } else {
      this.refreshEditors();
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
  //#endregion

  //#region private methods
  private getDataFromRoute() {
    this.route.paramMap.subscribe(async params => {
      const name = params.get('name');
      if (name) {
        this.editors.push(new Editor(uuidv4(), name));
      } else {
        const newEditor = await this.createEntityAndAddEditor(null);
        if (!newEditor) {
          this.onClosed.emit();
        }
      }
    });
  }

  private async createEntityAndAddEditor(currentEditorId: string | null): Promise<Editor | null> {
    const entityPath = await this.createNewEntity();
    if (!entityPath) {
      return null;
    } else {
      return this.addEditorForExistingEntity(currentEditorId, entityPath);
    }
  }

  private addEditorForExistingEntity(currentEditorId: string | null, entityPath: string) {
    // Compute the current editor index
    let currentEditorIndex = -1;
    if (currentEditorId) {
      currentEditorIndex = this.editors.findIndex(x => x.id === currentEditorId);
    }

    // Add the new editor
    const newEditor = new Editor(uuidv4(), entityPath);
    if (currentEditorIndex === -1) {
      this.editors.push(newEditor);
    } else {
      this.editors.splice(currentEditorIndex + 1, 0, newEditor);
    }

    // Refresh the UI
    this.refreshEditors();

    // Return
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

  private refreshEditors() {
    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  //#endregion
}
