import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Action } from '../blocks/action';
import { BlockService } from '../blocks/block.service';
import { ApiService } from './api.service';
import { Context } from './context';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(
    private api: ApiService,
    private blockService: BlockService,
  ) { }

  async run(actionName: string, context: Context, dialog: MatDialog): Promise<string> {
    // Get action
    const action = this.blockService.actions.getByName(actionName)?.content as Action | null;
    if (!action) {
      console.log(`Action '${actionName}' not found.`);
      return "";
    }

    // Initialize api
    const api = this.api;
    api.dialog = dialog;
    api.context = Context.clone(context); // context might get modified, we don't want to persist those changes
    api.rollAction = async (actionName: string): Promise<string> => await this.run(actionName, api.context, dialog);

    // Execute action
    const result: string | null = await eval(`(async function() { ${action.content} })()`);

    // Return result
    return result ? result.toString() : "";
  }
}
