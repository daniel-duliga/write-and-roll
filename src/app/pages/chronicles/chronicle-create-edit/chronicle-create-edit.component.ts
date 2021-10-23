import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  openChronicles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
  }

  //#region public methods
  openNewEditor() {
    this.openChronicles.push('');
  }
  
  updateChronicleName(oldName: string, newName: string) {
    const oldNameIndex = this.openChronicles.findIndex(x => x === oldName);
    if (oldNameIndex) {
      this.openChronicles[oldNameIndex] = newName;
    }
  }
  
  closeEditor(chronicleName: string) {
    this.openChronicles = this.openChronicles.filter(x => x !== chronicleName);
    if(this.openChronicles.length === 0) {
      this.router.navigate(['/chronicles']);
    }
  }
  //#endregion

  //#region private methods
    private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.openChronicles.push(name);
      } else {
        this.openChronicles.push('');
      }
    });
  }
    //#endregion
}
