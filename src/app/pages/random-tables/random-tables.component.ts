import { Component, OnInit } from '@angular/core';
import { RandomTable } from 'src/app/database/models/random-table';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-random-tables',
  templateUrl: './random-tables.component.html',
  styleUrls: ['./random-tables.component.css']
})
export class RandomTablesComponent implements OnInit {

  public dataSource: RandomTable[] = [];
  displayedColumns: string[] = ['name'];

  constructor(
    private randomTableService: RandomTableService
  ) { }

  async ngOnInit() {
    this.dataSource = await this.randomTableService.getAll();
  }

}
