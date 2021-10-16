import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsComponentService {
  constructor(
    private api: ApiService,
  ) { }

  async run(action: string, dialog: MatDialog): Promise<string> {
    // Provisioning
    const api = this.api;
    api.dialog = dialog;

    // Execute action
    const command: Function = eval(`(async function() { ${action} })`);
    const result: string = await command();
    
    // Return result
    return result.toString();
  }
}
