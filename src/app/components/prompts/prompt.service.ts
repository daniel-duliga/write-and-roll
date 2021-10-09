import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompletePromptComponent } from './auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptsWidth = '480px';

  constructor() { }

  openInputPrompt(dialog: MatDialog, message: string, callback: (selectedOption: string) => void,): void {
    dialog.open(
      InputComponent,
      {
        width: this.promptsWidth,
        data: {
          message: message,
          callback: (input: string) => callback(input)
        },
      }
    )
  }

  openAutoCompletePrompt(dialog: MatDialog, message: string, callback: (selectedOption: string) => void, options: string[], ): void {
    dialog.open(
      AutoCompletePromptComponent,
      {
        width: this.promptsWidth,
        data: {
          message: message,
          options: options,
          callback: (selectedOption: string) => callback(selectedOption)
        },
      }
    );
  }
}
