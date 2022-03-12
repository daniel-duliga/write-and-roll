import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { DbService } from 'src/app/database/db.service';
import { Note, NoteType } from 'src/app/database/models/note';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  allNotes: Note[] = [];
  filteredNotes: any[] = [];
  
  textFilter: string = '';
  notesFilter: boolean = false;
  randomTablesFilter: boolean = false;
  actionsFilter: boolean = false;

  public get showAddButtons(): boolean {
    return (this.textFilter !== '' && this.filteredNotes.length === 0);
  }
  
  constructor(
    private db: DbService,
  ) { }

  // lifecycle
  async ngOnInit() {
    await this.loadData();
    this.filteredNotes = this.allNotes.sort((a, b) => a.name.localeCompare(b.name));
    this.db.onChanges().on('change', _ => this.loadData());
  }
  ngOnChanges(_: SimpleChanges) {
    this.filter();
  }

  // events
  filterActions() {
    this.actionsFilter = !this.actionsFilter;
    this.filter();
  }
  filterNotes() {
    this.notesFilter = !this.notesFilter;
    this.filter();
  }
  filterRandomTables() {
    this.randomTablesFilter = !this.randomTablesFilter;
    this.filter();
  }
  filter() {
    this.filteredNotes = this.actionsFilter || this.notesFilter || this.randomTablesFilter ? [] : this.allNotes;
    
    if(this.actionsFilter) { 
      this.filteredNotes = this.filteredNotes.concat(this.allNotes.filter(x => x.type === 'action')); 
    }
    if(this.notesFilter) {
      this.filteredNotes = this.filteredNotes.concat(this.allNotes.filter(x => x.type === 'note')); 
    }
    if(this.randomTablesFilter) {
      this.filteredNotes = this.filteredNotes.concat(this.allNotes.filter(x => x.type === 'random-table'));
    }
    
    this.filteredNotes = this.filteredNotes
      .filter(x => x.name.toLowerCase().startsWith(this.textFilter.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // private methods
  async loadData() {
    this.allNotes = await this.db.notes.getAll();
  }
  async addNote(type: NoteType) {
    await this.db.notes.create(new Note(type, this.textFilter, ""));
  }
}
