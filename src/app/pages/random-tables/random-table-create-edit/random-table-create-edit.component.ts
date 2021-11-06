import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTableEntityService } from 'src/app/entities/services/random-table-entity.service';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {

  constructor(
    public entityService: RandomTableEntityService,
    private router: Router
  ) { }
  
  ngOnInit(): void { }

  navigateBack() {
    this.router.navigate(["/random-tables"]);
  }
}
