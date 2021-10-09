import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete-field',
  templateUrl: './auto-complete-field.component.html',
  styleUrls: ['./auto-complete-field.component.css']
})
export class AutoCompleteFieldComponent implements OnInit {
  @Input() message: string = 'Option';
  @Input() options: string[] = [];
  @Input() initialValue: string = '';
  @Input() trackTextChange: boolean = true;
  @Output() onOptionSelected: EventEmitter<string> = new EventEmitter<string>();
  
  inputControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  selectedOption: string = '';

  constructor() { }

  ngOnInit() {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.selectedOption = this.initialValue;
  }

  onOptionSelect(option: string) {
    this.onOptionSelected.emit(option);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
