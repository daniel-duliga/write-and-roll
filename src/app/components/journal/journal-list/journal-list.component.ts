import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalService } from 'src/app/storage/journal/journal.service';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
})
export class JournalListComponent implements OnInit {
  journalPaths: string[] = [];

  constructor(
    private router: Router,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {
    this.journalPaths = this.journalService.getAllPaths();
  }

  new() {
    this.router.navigate(['/journal/create-edit']);
  }
  
  add(folderPath: string) {
    this.edit(folderPath);
  }

  edit(path: string) {
    this.router.navigate(['/journal/create-edit', path]);
  }

  delete(path: string) {
    this.journalService.delete(path);
  }
}
