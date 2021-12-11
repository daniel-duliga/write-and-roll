import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(
    private api: ApiService,
  ) { }

  async run(action: string, dialog: MatDialog): Promise<string> {
    // Provisioning
    const api = this.api;
    api.dialog = dialog;

    // Execute action
    const command: Function = eval(`(async function() { ${action} })`);
    const result: string | null = await command();
    
    // Return result
    if(result) {
      return result.toString();
    } else {
      return "";
    }
  }
}
