import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RandomTableService } from 'src/app/storage/random-table/random-table.service';
import { RandomTableWrapper } from 'src/app/storage/random-table/random-table.wrapper';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {
  randomTable: RandomTableWrapper = new RandomTableWrapper();
  oldName: string = '';
  folders: string[] = [];

  constructor(
    private randomTableService: RandomTableService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
    this.folders = this.randomTableService.getAllFolderPaths();
  }

  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.randomTable = this.randomTableService.get(name);
        this.oldName = this.randomTable.name;
      }
    });
  }

  setName(name: string) {
    this.randomTable.name = name;
  }

  save() {
    // Validation
    let errors = '';
    
    if (this.randomTable.name.trim() === '') {
      errors += 'Name is required.\n';
    } else if (this.randomTable.name.trim().endsWith('/')) {
      errors += 'Name cannot end with "/".\n';
    }
    
    if (this.randomTable.rawContent.trim() === '') {
      errors += 'Content is required.\n';
    }
    
    if (errors !== '') {
      alert(errors);
      return;
    }
    
    // Save
    if (this.oldName) {
      this.randomTableService.delete(this.oldName);
    }
    this.randomTableService.create(this.randomTable.name, this.randomTable.rawContent);
    this.router.navigate(['random-tables']);
  }
}
