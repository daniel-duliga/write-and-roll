import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @ViewChild('input') input!: ElementRef;

  form!: FormGroup;
  message: string = 'Option';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<InputComponent>,
    private formBuilder: FormBuilder
  ) {
    this.message = data.message;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      input: [null, Validators.required]
    });
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }
  
  onFormSubmit() {
    this.dialogRef.close(this.form.value.input);
  }
}