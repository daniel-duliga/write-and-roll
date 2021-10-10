import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalService } from 'src/app/storage/journal/journal.service';

@Component({
  selector: 'app-chronicle-list',
  templateUrl: './chronicle-list.component.html',
  styleUrls: ['./chronicle-list.component.css']
})
export class ChronicleListComponent implements OnInit {
  journalPaths: string[] = [];

  constructor(
    private router: Router,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {
    this.journalPaths = this.journalService.getAllPaths();
  }

  new() {
    this.router.navigate(['/chronicle/create-edit']);
  }
  
  add(folderPath: string) {
    this.edit(folderPath);
  }

  edit(path: string) {
    this.router.navigate(['/chronicle/create-edit', path]);
  }

  delete(path: string) {
    this.journalService.delete(path);
  }
}
