import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() title: string = '';
  @Output() onSelect: EventEmitter<string> = new EventEmitter();
  @Output() onCreate: EventEmitter<string> = new EventEmitter();

  filteredOptions: string[] = [];
  filter: string = '';

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.options.sort((a, b) => a.localeCompare(b));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterOptions();
  }

  filterOptions() {
    this.filteredOptions = this.options
      .filter(x => x.toLowerCase().startsWith(this.filter.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  }

  addItem() {
    this.onCreate.emit(this.filter);
    this.options.push(this.filter);
    this.filterOptions();
  }
}
