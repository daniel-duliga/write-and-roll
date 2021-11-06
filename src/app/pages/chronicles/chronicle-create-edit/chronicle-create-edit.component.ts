import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChronicleEntityService } from 'src/app/entities/services/chronicle-entity.service';
import { EditorComponent, MoveDirection } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';
import { PromptService } from 'src/app/components/prompts/prompt.service';
import { MatDialog } from '@angular/material/dialog';
import { Editor } from 'src/app/components/editor/editor';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  @ViewChildren('editor') editors!: QueryList<EditorComponent>;

  openEntities: Editor[] = [];
  addNewOption = '> Add New';

  constructor(
    public entityService: ChronicleEntityService,
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
  }

  //#region public methods
  async openNewEditor(currentEditorId: string) {
    const entities = this.entityService.getAll(false);
    entities.push(this.addNewOption);

    let targetPath: string | null = await this.promptService.openAutoCompletePrompt(this.dialog, "Chronicle", entities);
    if (!targetPath) {
      return;
    } else if (targetPath === this.addNewOption) {
      targetPath = await this.createNewEntity(targetPath);
      if (!targetPath) {
        return;
      }
    }

    const newEditor = new Editor(uuidv4(), targetPath);
    const currentEditorIndex = this.openEntities.findIndex(x => x.id === currentEditorId);
    if (currentEditorIndex === -1) {
      this.openEntities.push(newEditor);
    } else {
      this.openEntities.splice(currentEditorIndex + 1, 0, newEditor);
    }

    this.refreshEditors();
  }

  closeEditor(id: string) {
    this.openEntities = this.openEntities.filter(x => x.id !== id);
    if (this.openEntities.length === 0) {
      this.router.navigate(['/chronicles']);
    } else {
      this.refreshEditors();
    }
  }

  updateChronicleName(id: string, newName: string) {
    const oldNameIndex = this.openEntities.findIndex(x => x.id === id);
    if (oldNameIndex) {
      this.openEntities[oldNameIndex].name = newName;
    }
    this.refreshEditors();
  }

  moveEditor(id: string, direction: MoveDirection) {
    const editorIndex = this.openEntities.findIndex(x => x.id === id);
    if (editorIndex !== -1) {
      const editor = this.openEntities[editorIndex];
      if (direction === "left" && editorIndex !== 0) {
        this.openEntities.splice(editorIndex, 1);
        this.openEntities.splice(editorIndex - 1, 0, editor);
      } else if (direction === "right" && editorIndex !== this.openEntities.length - 1) {
        this.openEntities.splice(editorIndex, 1);
        this.openEntities.splice(editorIndex + 1, 0, editor);
      }
    }
  }
  //#endregion

  //#region private methods
  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.openEntities.push({ id: uuidv4(), name: name });
      } else {
        this.openEntities.push({ id: uuidv4(), name: '' });
      }
    });
  }

  private async createNewEntity(path: string): Promise<string | null> {
    const allFolders = this.entityService.getAllParents();
    
    const folders = allFolders;
    folders.push(this.addNewOption);

    let targetFolder = await this.promptService.openAutoCompletePrompt(this.dialog, 'Folder', folders);
    if (!targetFolder) {
      return null;
    } else if (targetFolder === this.addNewOption) {
      const parentFolder = await this.promptService.openAutoCompletePrompt(this.dialog, 'Parent Folder', allFolders);
      targetFolder = await this.promptService.openInputPrompt(this.dialog, 'Folder Name');
      if (!targetFolder) {
        return null;
      }
      targetFolder = `${parentFolder}${targetFolder}/`;
    }

    const newName = await this.promptService.openInputPrompt(this.dialog, 'Name');
    if (!newName) {
      return null;
    }

    path = `${targetFolder}${newName}`;

    const existingEntity = this.entityService.get(path);
    if (existingEntity) {
      alert(`Entity '${path}' already exists.'`);
      return null;
    }

    this.entityService.create(path, '');
    return path;
  }

  private refreshEditors() {
    for (const editor of this.editors) {
      editor.refresh();
    }
  }
  //#endregion
}
