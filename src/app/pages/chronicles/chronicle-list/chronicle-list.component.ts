import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChronicleEntityService } from 'src/app/entities/services/chronicle-entity.service';

@Component({
  selector: 'app-chronicle-list',
  templateUrl: './chronicle-list.component.html',
  styleUrls: ['./chronicle-list.component.css']
})
export class ChronicleListComponent implements OnInit {
  journalPaths: string[] = [];

  constructor(
    public chronicleEntityService: ChronicleEntityService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.journalPaths = this.chronicleEntityService.getAllPaths();
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
    this.chronicleEntityService.delete(path);
  }
}
