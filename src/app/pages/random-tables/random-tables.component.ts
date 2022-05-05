import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTable } from 'src/app/database/models/random-table';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-random-tables',
  templateUrl: './random-tables.component.html',
  styleUrls: ['./random-tables.component.css']
})
export class RandomTablesComponent implements OnInit {

  public randomTables: RandomTable[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor(
    private router: Router,
    private randomTableService: RandomTableService
  ) { }

  async ngOnInit() {
    this.randomTables = await this.randomTableService.getAll();
  }

  edit(randomTable: RandomTable) {
    this.router.navigate(['/app/random-tables', randomTable._id]);
  }

}
