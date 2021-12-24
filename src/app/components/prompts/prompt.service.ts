import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompletePromptComponent } from './auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptPosition = {
    top: '100px'
  };

  constructor() { }

  input(dialog: MatDialog, message: string, initialValue: string = ''): Promise<string> {
    const openedDialog = dialog.open(
      InputComponent, {
      position: this.promptPosition,
      data: { message: message, initialValue: initialValue },
    });
    return openedDialog.afterClosed().toPromise().then(((result: string) => result));
  }

  autocomplete(dialog: MatDialog, title: string, message: string, options: string[]): Promise<string> {
    const openedDialog = dialog.open(
      AutoCompletePromptComponent,
      {
        width: '480px',
        position: this.promptPosition,
        data: {
          title: title,
          message: message,
          options: options,
        },
      }
    );
    return openedDialog.afterClosed().toPromise().then((result: string) => result);
  }
}
