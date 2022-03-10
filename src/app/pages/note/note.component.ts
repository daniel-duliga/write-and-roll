import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @ViewChild('editor') private readonly editor!: EditorComponent;
  
  noteId: string = '';
  note: Note = new Note();

  constructor(
    public router: Router,
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

  save() {
    this.note.content = this.editor.content;
    this.db.systemNotes.update(this.note);
  }

  async loadData() {
    this.note = await this.db.systemNotes.get(this.noteId);
  }
}
