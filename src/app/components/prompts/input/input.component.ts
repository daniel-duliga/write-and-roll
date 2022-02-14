import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
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
  initialValue: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, initialValue: string },
    public dialogRef: MatDialogRef<InputComponent>,
    private formBuilder: FormBuilder,
    private zone: NgZone
  ) {
    this.message = data.message;
    this.initialValue = data.initialValue;
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
    this.zone.run(() => this.dialogRef.close(this.form.value.input));
  }
}
