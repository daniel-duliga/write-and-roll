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
      console.log(`Action '${id}' not found.`);
      return "";
    }

    // Initialize api
    const api = this.api;
    api.dialog = dialog;
    api.context = context ? Context.clone(context) : new Context(''); // context might get modified, we don't want to persist those changes
    api.rollAction = async (actionName: string): Promise<string> => await this.run(actionName, api.context, dialog);

    // Execute action
    const result: string | null = await eval(`(async function() { ${action.content} })()`);

    // Return result
    return result ? result.toString() : "";
  }
}
