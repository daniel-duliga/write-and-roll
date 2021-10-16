import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChronicleStorageService } from 'src/app/storage/model-services/chronicle-storage.service';

@Component({
  selector: 'app-chronicle-list',
  templateUrl: './chronicle-list.component.html',
  styleUrls: ['./chronicle-list.component.css']
})
export class ChronicleListComponent implements OnInit {
  journalPaths: string[] = [];

  constructor(
    public chronicleStorageService: ChronicleStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.journalPaths = this.chronicleStorageService.getAllPaths();
  }

  new() {
    this.router.navigate(['/chronicles/create-edit']);
  }
  
  add(folderPath: string) {
    this.edit(folderPath);
  }

  edit(path: string) {
    this.router.navigate(['/chronicles/create-edit', path]);
  }

  delete(path: string) {
    this.chronicleStorageService.delete(path);
  }
}
