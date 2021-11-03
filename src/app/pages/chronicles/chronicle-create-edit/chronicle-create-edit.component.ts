import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChronicleEntityService } from 'src/app/entities/services/chronicle-entity.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
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
  openNewEditor() {
    this.openChronicles.push({ id: uuidv4(), name: '' });
  }

  updateChronicleName(id: string, newName: string) {
    const oldNameIndex = this.openChronicles.findIndex(x => x.id === id);
    if (oldNameIndex) {
      this.openChronicles[oldNameIndex].name = newName;
    }
  }

  closeEditor(id: string) {
    this.openChronicles = this.openChronicles.filter(x => x.id !== id);
    if (this.openChronicles.length === 0) {
      this.router.navigate(['/chronicles']);
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
  //#endregion
}
