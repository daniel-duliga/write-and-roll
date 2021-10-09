import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  form!: FormGroup;
  
  message: string = 'Option';
  callback!: Function;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, callback: (option: string) => void },
    public dialogRef: MatDialogRef<InputComponent>,
    private formBuilder: FormBuilder
  ) {
    this.message = data.message;
    this.callback = data.callback;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      input: [null, Validators.required]
    });
  }
  
  onFormSubmit() {
    this.callback(this.form.value.input);
    this.dialogRef.close();
  }
}
