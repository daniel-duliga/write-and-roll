import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoCompleteFieldComponent } from '../../auto-complete-field/auto-complete-field.component';

@Component({
  selector: 'app-auto-complete-prompt',
  templateUrl: './auto-complete-prompt.component.html',
  styleUrls: ['./auto-complete-prompt.component.css']
})
export class AutoCompletePromptComponent implements OnInit {
  @ViewChild('autoComplete') autoCompleteField!: AutoCompleteFieldComponent;
  
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

  onEnterKey() {
    this.onOptionSelect(this.autoCompleteField.selectedOption || this.autoCompleteField.inputControl.value);
  }
}
