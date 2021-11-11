import { Component, Input, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EditorComponent, EditorMode, MoveDirection } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';
import { PromptService } from 'src/app/components/prompts/prompt.service';
import { MatDialog } from '@angular/material/dialog';
import { Editor } from 'src/app/entities/models/editor';
import { EntityService } from 'src/app/entities/services/entity.service';
import { EditorListService } from 'src/app/components/editor-list/editor-list.service';

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
    private promptService: PromptService,
    private dialog: MatDialog,
    private editorListService: EditorListService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.editorListService.onEditorOpened.subscribe(entityId => {
      this.ngZone.run(() => this.openEditor(entityId, false));
    })
  }

  //#region public methods
  openEditor(entityId: string, minimized = false) {
    this.openEditorForExistingEntity(entityId, minimized);
  }

  public async createEntityAndOpenEditor(): Promise<Editor | null> {
    const entityId = await this.createNewEntity();
    if (!entityId) {
      return null;
    } else {
      return this.openEditorForExistingEntity(entityId, false);
    }
  }

  closeEditor(id: string) {
    let editor = this.editors.find(x => x.id === id);
    if (editor) {
      this.editors = this.editors.filter(x => x.id !== id);
      this.entityService.removeOpenEditor(editor);
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
    this.entityService.updateOpenedEditor(editor);
  }

  refreshEditors() {
    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
  //#endregion

  //#region private methods
  private openEditorForExistingEntity(entityId: string, minimized: boolean) {
    const newEditor = new Editor(uuidv4(), entityId, minimized);
    this.editors.push(newEditor);
    this.entityService.addOpenedEditor(newEditor);
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

    const entityId = `${targetFolder}${newName}`;

    const existingEntity = this.entityService.get(entityId);
    if (existingEntity) {
      alert(`Entity '${entityId}' already exists.'`);
      return null;
    }

    this.entityService.create(entityId, '');
    return entityId;
  }
  //#endregion
}
