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

  openChronicles: Editor[] = [];

  constructor(
    public chronicleEntityService: ChronicleEntityService,
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
    const otherChronicles = this.chronicleEntityService.getAllPaths(false);
    const newOption = 'New';
    otherChronicles.push(newOption);
    let newChronicle = await this.promptService.openAutoCompletePrompt(this.dialog, "Chronicle", otherChronicles);
    if (newChronicle) {
      if (newChronicle === newOption) {
        newChronicle = await this.promptService.openInputPrompt(this.dialog, 'Name');
        this.chronicleEntityService.create(newChronicle, '');
      }
      const newEditor = new Editor(uuidv4(), newChronicle);
      const currentEditorIndex = this.openChronicles.findIndex(x => x.id === currentEditorId);
      if (currentEditorIndex === -1) {
        this.openChronicles.push(newEditor);
      } else {
        this.openChronicles.splice(currentEditorIndex + 1, 0, newEditor);
      }

      this.refreshEditors();
    }
  }

  closeEditor(id: string) {
    this.openChronicles = this.openChronicles.filter(x => x.id !== id);
    if (this.openChronicles.length === 0) {
      this.router.navigate(['/chronicles']);
    } else {
      this.refreshEditors();
    }
  }

  updateChronicleName(id: string, newName: string) {
    const oldNameIndex = this.openChronicles.findIndex(x => x.id === id);
    if (oldNameIndex) {
      this.openChronicles[oldNameIndex].name = newName;
    }
    this.refreshEditors();
  }

  moveEditor(id: string, direction: MoveDirection) {
    const editorIndex = this.openChronicles.findIndex(x => x.id === id);
    if (editorIndex !== -1) {
      const editor = this.openChronicles[editorIndex];
      if (direction === "left" && editorIndex !== 0) {
        this.openChronicles.splice(editorIndex, 1);
        this.openChronicles.splice(editorIndex - 1, 0, editor);
      } else if (direction === "right" && editorIndex !== this.openChronicles.length - 1) {
        this.openChronicles.splice(editorIndex, 1);
        this.openChronicles.splice(editorIndex + 1, 0, editor);
      }
    }
  }
  //#endregion

  //#region private methods
  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.openChronicles.push({ id: uuidv4(), name: name });
      } else {
        this.openChronicles.push({ id: uuidv4(), name: '' });
      }
    });
  }

  private refreshEditors() {
    for (const editor of this.editors) {
      editor.refresh();
    }
  }
  //#endregion
}
