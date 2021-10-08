import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { RandomTableService } from 'src/app/services/random-table.service';
import { RandomTable } from 'src/app/wrappers/RandomTable';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {
  randomTable: RandomTable = new RandomTable();
  oldName: string = '';

  constructor(
    private randomTableService: RandomTableService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.randomTable = this.randomTableService.get(name);
        this.oldName = this.randomTable.name;
      }
    });
  }

  save(): void {
    // Validation
    let errors = '';
    if (this.randomTable.name.trim() === '') {
      errors += 'Name is required.\n';
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
