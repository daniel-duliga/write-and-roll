import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(
    private api: ApiService
  ) { }

  run(action: string, dialog: MatDialog): string {
    // Provisioning
    const api = this.api;
    api.dialog = dialog;
    
    // Execute action
    const result: string = eval(action);
    
    // Return result
    return result.toString();
  }
}
