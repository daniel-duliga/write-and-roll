import { Component, OnInit } from '@angular/core';
import { ActionStorageService } from 'src/app/storage/action-storage.service';
import { IEntity } from 'src/app/storage/IEntity';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-action-create-edit',
  templateUrl: './action-create-edit.component.html',
  styleUrls: ['./action-create-edit.component.css']
})
export class ActionCreateEditComponent implements OnInit {
  content: string = '';

  constructor(
    public actionStorageService: ActionStorageService,
    private actionService: ActionService,
  ) { }

  ngOnInit(): void { }

  onChanged(entity: IEntity): void {
    this.content = entity.rawContent;
  }

  run(): void {
    const result = this.actionService.run(this.content);
    alert(result);
  }
}
