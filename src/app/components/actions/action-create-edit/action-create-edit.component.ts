import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  onChanged(entity: IEntity): void {
    this.content = entity.rawContent;
  }

  async run(): Promise<void> {
    const result = await this.actionService.run(this.content, this.dialog);
    alert(result);
    return Promise.resolve();
  }
}
