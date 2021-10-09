import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTableService } from 'src/app/storage/random-table/random-table.service';

@Component({
  selector: 'app-random-table-list',
  templateUrl: './random-table-list.component.html',
  styleUrls: ['./random-table-list.component.css']
})
export class RandomTableListComponent implements OnInit {
  randomTablePaths: string[] = [];

  constructor(
    private randomTableService: RandomTableService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.randomTablePaths = this.randomTableService.getAll();
  }

  edit(path: string): void {
    this.router.navigate(['/random-tables/create-edit', path]);
  }

  delete(path: string): void {
    this.randomTableService.delete(path);
  }
}
