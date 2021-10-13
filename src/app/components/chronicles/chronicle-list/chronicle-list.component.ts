import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalStorageService } from 'src/app/storage/journal-storage.service';

@Component({
  selector: 'app-chronicle-list',
  templateUrl: './chronicle-list.component.html',
  styleUrls: ['./chronicle-list.component.css']
})
export class ChronicleListComponent implements OnInit {
  journalPaths: string[] = [];

  constructor(
    private router: Router,
    private journalService: JournalStorageService
  ) { }

  ngOnInit(): void {
    this.journalPaths = this.journalService.getAllPaths();
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
    this.journalService.delete(path);
  }
}
