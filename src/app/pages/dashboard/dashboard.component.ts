import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';
import { NoteListComponent } from 'src/app/components/note-list/note-list.component';
import { Editor } from 'src/app/database/models/editor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('noteList') noteList!: NoteListComponent;
  
  showPicker = false;
  editors: Editor[] = [];

  constructor(
    public router: Router,
    private db: DbService,
  ) { }

  // lifecycle
  async ngOnInit() {
    this.editors = await this.db.editors.getAll();
  }
  ngAfterViewInit() { }

  // host listener events
  @HostListener('keydown.control.o', ['$event'])
  keydown_ControlS(e: Event) {
    if (e) { e.preventDefault(); } // If triggered by key combination, prevent default browser action
    this.showPicker = true;
  }

  // events
  async openEditor(noteId: string) {
    const editor = await this.db.editors.create(new Editor(noteId));
    this.editors.push(editor);
    this.showPicker = false;
  }
  closeEditor(editorId: string) {
    const editor = this.editors.find(x => x._id === editorId);
    if(editor) {
      this.editors = this.editors.filter(x => x._id !== editor._id);
      this.db.editors.delete(editor);
    }
  }
}
