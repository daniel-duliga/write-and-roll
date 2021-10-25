import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTableEntityService } from 'src/app/entities/services/random-table-entity.service';

@Component({
  selector: 'app-random-table-list',
  templateUrl: './random-table-list.component.html',
  styleUrls: ['./random-table-list.component.css']
})
export class RandomTableListComponent implements OnInit {
  randomTablePaths: string[] = [];

  constructor(
    public randomTableEntityService: RandomTableEntityService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.randomTablePaths = this.randomTableEntityService.getAllPaths();
  }

  new() {
    this.router.navigate(['/random-tables/create-edit']);
  }
  
  add(folderPath: string) {
    this.edit(folderPath);
  }

  edit(path: string) {
    this.router.navigate(['/random-tables/create-edit', path]);
  }

  delete(path: string) {
    this.randomTableEntityService.delete(path);
  }
}
