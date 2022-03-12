import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';
import { NoteListComponent } from 'src/app/components/note-list/note-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('noteList') noteList!: NoteListComponent;
  
  openNotes: Note[] = [];

  constructor(
    private db: DbService,
    public router: Router
  ) { }

  // lifecycle
  ngOnInit() { }
  ngAfterViewInit() { }

  // events
  openNote(note: Note) {
    this.openNotes.unshift(note);
  }
  closeNote(note: Note) {
    this.openNotes = this.openNotes.filter(x => x !== note);
  }
}
