import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompletePromptComponent } from './auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptsWidth = '100%';

  constructor() { }

  openInputPrompt(dialog: MatDialog, message: string): Promise<string> {
    const openedDialog = dialog.open(
      InputComponent,
      {
        width: this.promptsWidth,
        data: { message: message }
      });
    return openedDialog.afterClosed().toPromise().then(((result: string) => result));
  }

  openAutoCompletePrompt(dialog: MatDialog, message: string, options: string[]): Promise<string> {
    const openedDialog = dialog.open(
      AutoCompletePromptComponent,
      {
        width: this.promptsWidth,
        data: {
          message: message,
          options: options
        },
      }
    );
    return openedDialog.afterClosed().toPromise().then((result: string) => result);
  }
}
