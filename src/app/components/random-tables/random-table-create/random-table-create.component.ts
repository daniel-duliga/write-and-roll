import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-random-table-create',
  templateUrl: './random-table-create.component.html',
  styleUrls: ['./random-table-create.component.css']
})
export class RandomTableCreateComponent implements OnInit {
  name: string = '';
  content: string = '';

  constructor(private randomTableService: RandomTableService, private router: Router) { }

  ngOnInit(): void { }
  
  save(): void {
    // Validation
    let errors = '';
    if (this.name.trim() === '') {
      errors += 'Name is required.\n';
    }
    if (this.content.trim() === '') {
      errors += 'Content is required.\n';
    }
    if (errors !== '') {
      alert(errors);
      return;
    }
    // Save
    this.randomTableService.create(this.name, this.content);
    this.router.navigate(['random-tables']);
  }
}
