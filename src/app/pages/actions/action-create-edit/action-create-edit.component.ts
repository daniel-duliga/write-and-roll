import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityEditorComponentBase } from 'src/app/entities/entity-editor-component-base';
import { ActionEntityService } from 'src/app/entities/services/action-entity.service';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-action-create-edit',
  templateUrl: './action-create-edit.component.html',
  styleUrls: ['./action-create-edit.component.css']
})
export class ActionCreateEditComponent extends EntityEditorComponentBase implements OnInit {
  constructor(
    public actionEntityService: ActionEntityService,
    private actionService: ActionsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDataFromRoute(this.route, this.actionEntityService);
  }

  closeEditor() {
    this.router.navigate(['/actions']);
  }

  onChanged(content: string): void {
    this.entity.rawContent = content;
  }

  async run(): Promise<void> {
    const result = await this.actionService.run(this.entity.rawContent, this.dialog);
    alert(result);
    return Promise.resolve();
  }
}
