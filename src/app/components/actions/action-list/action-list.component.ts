import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionStorageService } from 'src/app/storage/model-services/action-storage.service';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
  actionPaths: string[] = [];

  constructor(
    public actionStorageService: ActionStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.actionPaths = this.actionStorageService.getAllPaths();
  }

  new() {
    this.router.navigate(['/actions/create-edit']);
  }
  
  add(folderPath: string) {
    this.edit(folderPath);
  }

  edit(path: string) {
    this.router.navigate(['/actions/create-edit', path]);
  }

  delete(path: string) {
    this.actionStorageService.delete(path);
  }
}
