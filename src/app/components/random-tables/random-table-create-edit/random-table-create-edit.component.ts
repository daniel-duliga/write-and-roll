import { Component, OnInit } from '@angular/core';
import { RandomTableStorageService } from 'src/app/storage/model-services/random-table-storage.service';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {

  constructor(
    public randomTableService: RandomTableStorageService,
  ) { }

  ngOnInit() { }
}
