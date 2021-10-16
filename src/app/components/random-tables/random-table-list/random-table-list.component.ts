import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomTableStorageService } from 'src/app/storage/model-services/random-table-storage.service';

@Component({
  selector: 'app-random-table-list',
  templateUrl: './random-table-list.component.html',
  styleUrls: ['./random-table-list.component.css']
})
export class RandomTableListComponent implements OnInit {
  randomTablePaths: string[] = [];

  constructor(
    public randomTableStorageService: RandomTableStorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.randomTablePaths = this.randomTableStorageService.getAllPaths();
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
    this.randomTableStorageService.delete(path);
  }
}
