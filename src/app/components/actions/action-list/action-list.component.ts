import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/storage/action/action.service';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
  actionPaths: string[] = [];

  constructor(
    private actionService: ActionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.actionPaths = this.actionService.getAllPaths();
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
    this.actionService.delete(path);
  }
}
