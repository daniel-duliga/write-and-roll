import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() title: string = '';
  @Input() options: any[] = [];
  @Input() displayProperty: string = '';
  @Input() valueProperty: string = '';
  
  @Output() onSelect: EventEmitter<string> = new EventEmitter();
  @Output() onCreate: EventEmitter<string> = new EventEmitter();

  filteredOptions: any[] = [];
  filter: string = '';

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.options.sort(
      (a, b) => a[this.displayProperty].localeCompare(b[this.displayProperty]));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterOptions();
  }

  filterOptions() {
    this.filteredOptions = this.options
      .filter(x => x[this.displayProperty].toLowerCase().startsWith(this.filter.toLowerCase()))
      .sort((a, b) => a[this.displayProperty].localeCompare(b[this.displayProperty]));
  }

  add() {
    this.onCreate.emit(this.filter);
  }
}
