import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { from, Observable, of } from 'rxjs';
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

  @Output() onOptionChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onTextChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatAutocomplete) autoComplete!: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  @ViewChild('input') autocompleteInput!: ElementRef;

  inputControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  selectedOption: string = '';

  constructor() { }

  //#region lifecycle events
  ngOnInit() {
    this.initializeOptions();
  }

  ngAfterViewInit() {
    this.autoComplete.autoActiveFirstOption = true;
    this.autoComplete.options.first.setActiveStyles();
  }
  //#endregion

  //#region custom events
  onPanelOpened() {
    this.autocompleteInput.nativeElement.focus();
  }

  onOptionChanged(option: string) {
    this.inputControl.setValue('');
    this.onOptionChange.emit(option);
  }

  onTextChanged(newValue: string) {
    this.onTextChange.emit(newValue);
  }
  //#endregion

  public setOptions(options: string[], openPanel: boolean = false) {
    this.options = options;
    this.initializeOptions();
    if (openPanel) {
      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      }, 0);
    }
  }

  //#region private methods
  private initializeOptions() {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.selectedOption = this.initialValue;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  //#endregion
}
