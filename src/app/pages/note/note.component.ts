import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  noteId: string = '';
  note: Note = new Note();

  constructor(
    private db: DbService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const noteId = this.route.snapshot.paramMap.get('noteId');
    if(noteId) {
      this.noteId = noteId;
      await this.loadData();
      await this.db.onChanges().on('change', _ => this.loadData());
    } else {
      // todo: error handling
    }
  }

  save(content: string) {
    this.note.content = content;
    this.db.systemNotes.update(this.note);
  }

  async loadData() {
    this.note = await this.db.systemNotes.get(this.noteId);
  }
}
