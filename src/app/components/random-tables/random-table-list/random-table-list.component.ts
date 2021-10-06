import { Component, OnInit } from '@angular/core';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-random-table-list',
  templateUrl: './random-table-list.component.html',
  styleUrls: ['./random-table-list.component.css']
})
export class RandomTableListComponent implements OnInit {
  randomTables: string[] = [];

  constructor(
    private randomTableService: RandomTableService
    ) { }

  ngOnInit(): void {
    this.randomTables = this.randomTableService.getAll();
  }

  delete(path: string): void {
    if(confirm(`Are you sure you want to delete ${path}?`)) {
      this.randomTableService.delete(path);
      this.randomTables = this.randomTables.filter(x => x !== path);
    }
  }
}
