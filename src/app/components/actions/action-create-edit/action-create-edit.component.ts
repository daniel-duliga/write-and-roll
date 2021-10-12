import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/storage/action/action.service';

@Component({
  selector: 'app-action-create-edit',
  templateUrl: './action-create-edit.component.html',
  styleUrls: ['./action-create-edit.component.css']
})
export class ActionCreateEditComponent implements OnInit {
  constructor(
    public actionService: ActionService
  ) { }

  ngOnInit(): void { }

  run(): void {
    
  }
}
