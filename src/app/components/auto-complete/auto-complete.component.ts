import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  inputControl = new FormControl();
  message: string = 'Option';
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  selectedOption: string = '';
  callback!: Function;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string, options: string[], callback: (option: string) => void },
    public dialogRef: MatDialogRef<AutoCompleteComponent>
  ) {
    this.message = data.message;
    this.options = data.options;
    this.callback = data.callback;
  }

  ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onOptionSelect(option: string): void {
    this.callback(option);
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
