import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompletePromptComponent } from './auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptPosition = {
    top: '35px'
  };

  constructor() { }

  async input(dialog: MatDialog, message: string, initialValue: string = ''): Promise<string> {
    const openedDialog = dialog.open(
      InputComponent, {
      position: this.promptPosition,
      data: { message: message, initialValue: initialValue },
    });
    return openedDialog.afterClosed().toPromise().then(((result: string) => result));
  }

  async autocomplete(dialog: MatDialog, message: string, options: string[]): Promise<string> {
    const openedDialog = dialog.open(
      AutoCompletePromptComponent,
      {
        width: '480px',
        position: this.promptPosition,
        data: { message: message, options: options },
      }
    );
    return openedDialog.afterClosed().toPromise().then((result: string) => result);
  }
}
