import { Component, OnInit } from '@angular/core';
import { RandomTableService } from 'src/app/storage/random-table/random-table.service';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {

  constructor(
    public randomTableService: RandomTableService,
  ) { }

  ngOnInit() { }
}
