import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { InputComponent } from './input/input.component';

@Injectable({
  providedIn: 'root'
})
export class PromptsService {
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
      AutoCompleteComponent,
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
