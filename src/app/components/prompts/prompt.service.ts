import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompletePromptComponent } from './auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptWidth = '100%';
  private promptPosition = {
    top: '100px'
  };

  constructor() { }

  openInputPrompt(dialog: MatDialog, message: string): Promise<string> {
    const openedDialog = dialog.open(
      InputComponent, {
      width: this.promptWidth,
      position: this.promptPosition,
      data: { message: message },
    });
    return openedDialog.afterClosed().toPromise().then(((result: string) => result));
  }

  openAutoCompletePrompt(dialog: MatDialog, message: string, options: string[]): Promise<string> {
    const openedDialog = dialog.open(
      AutoCompletePromptComponent,
      {
        width: this.promptWidth,
        position: {
          top: '100px'
        },
        data: {
          message: message,
          options: options
        },
      }
    );
    return openedDialog.afterClosed().toPromise().then((result: string) => result);
  }
}
