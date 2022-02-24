import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-grid-picker',
  templateUrl: './grid-picker.component.html',
  styleUrls: ['./grid-picker.component.css']
})
export class GridPickerComponent implements OnInit {
  @Input() options: string[] = [];
  @Output() optionSelected: EventEmitter<string> = new EventEmitter();

  filteredOptions: string[] = [];
  filter: string = '';

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  filterOptions() {
    this.filteredOptions = this.options.filter(x => x.toLowerCase().startsWith(this.filter.toLowerCase()));
  }
}
