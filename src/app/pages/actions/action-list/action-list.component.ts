import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionEntityService } from 'src/app/entities/services/action-entity.service';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
  actionPaths: string[] = [];

  constructor(
    public actionEntityService: ActionEntityService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.actionPaths = this.actionEntityService.getAll();
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
    this.actionEntityService.delete(path);
  }
}
