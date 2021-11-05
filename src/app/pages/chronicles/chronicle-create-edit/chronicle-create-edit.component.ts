import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChronicleEntityService } from 'src/app/entities/services/chronicle-entity.service';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  @ViewChildren('editor') editors!: QueryList<EditorComponent>;

  openChronicles: { id: string, name: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public chronicleEntityService: ChronicleEntityService,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
  }

  //#region public methods
  openNewEditor(currentEditorId: string) {
    const newEditor = { id: uuidv4(), name: '' };
    const currentEditorIndex = this.openChronicles.findIndex(x => x.id === currentEditorId);
    if (currentEditorIndex === -1) {
      this.openChronicles.push(newEditor);
    } else {
      this.openChronicles.splice(currentEditorIndex + 1, 0, newEditor);
    }
    this.refreshEditors();
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
