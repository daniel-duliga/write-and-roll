import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-auto-complete-prompt',
  templateUrl: './auto-complete-prompt.component.html',
  styleUrls: ['./auto-complete-prompt.component.css']
})
export class AutoCompletePromptComponent implements OnInit {
  message: string = 'Option';
  callback!: Function;
  options: string[] = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, callback: (option: string) => void, options: string[] },
    public dialogRef: MatDialogRef<AutoCompletePromptComponent>
  ) {
    this.message = data.message;
    this.callback = data.callback;
    this.options = data.options;
  }

  ngOnInit(): void { }

  onOptionSelect(option: string): void {
    this.callback(option);
    this.dialogRef.close();
  }
}
