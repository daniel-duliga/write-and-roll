import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DbService } from 'src/app/database/db.service';
import { ApiService } from './api.service';
import { Context } from './context';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(
    private api: ApiService,
    private db: DbService,
  ) { }

  async run(id: string, context: Context | null, dialog: MatDialog): Promise<string> {
    // Get action
    const action = await this.db.notes.get(id);
    if (!action) {
      console.log(`Action with id '${id}' not found.`);
      return "";
    }

    // Initialize api
    const api = this.api;
    api.dialog = dialog;
    // context might get modified, we don't want to persist those changes
    api.context = context ? Context.clone(context) : new Context('');
    // rollAction() must be defined here
    api.rollAction = async (actionName: string): Promise<string> => this.rollAction(actionName, api, dialog);

    // Execute action
    const result: string | null = await eval(`(async function() { ${action.content} })()`);

    // Return result
    return result ? result.toString() : "";
  }

  private async rollAction(actionName: string, api: ApiService, dialog: MatDialog): Promise<string> {
    const action = await this.db.notes.first({ type: 'action', name: actionName });
    if (action) {
      return await this.run(action._id, api.context, dialog);
    } else {
      console.log(`Action with name '${actionName}' was not found`);
      return '';
    }
  }
}
