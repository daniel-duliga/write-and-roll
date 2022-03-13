import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { DbService } from 'src/app/database/db.service';
import { Note, NoteType } from 'src/app/database/models/note';
import { EventUtil } from 'src/app/utils/event-util';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onRoll: EventEmitter<Note> = new EventEmitter();

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
    await this.db.onChanges().on('change', _ => this.loadData());
  }
  ngOnChanges(_: SimpleChanges) {
    this.filter();
  }

  // filtering
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

  // events
  roll(e: Event, note: Note) {
    EventUtil.stopEvent(e);
    this.onRoll.emit(note);
  }

  // private methods
  async loadData() {
    this.allNotes = await this.db.notes.getAll();
    this.filter();
  }
  async addNote(type: NoteType) {
    await this.db.notes.create(new Note(type, this.textFilter, ""));
  }
  async deleteNote(e: Event, id: string) {
    EventUtil.stopEvent(e);
    if(confirm("Are you sure?")) {
      const note = await this.db.notes.get(id);
      await this.db.notes.delete(note);
    }
  }
}
