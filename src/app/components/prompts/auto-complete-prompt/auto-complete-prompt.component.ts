import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-auto-complete-prompt',
  templateUrl: './auto-complete-prompt.component.html',
  styleUrls: ['./auto-complete-prompt.component.css']
})
export class AutoCompletePromptComponent implements OnInit {
  message: string = 'Option';
  options: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, options: string[] },
    public dialogRef: MatDialogRef<AutoCompletePromptComponent>
  ) {
    this.message = data.message;
    this.options = data.options;
  }

  ngOnInit() { }

  onOptionSelect(option: string) {
    this.dialogRef.close(option);
  }
}
