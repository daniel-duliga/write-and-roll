import { Component, OnInit } from '@angular/core';
import { BlockService } from './modules/blocks/block.service';
import { NoteService } from './modules/notes/services/note.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(
    private blockService: BlockService,
    private noteService: NoteService,
  ) { }

  ngOnInit(): void {
    const notes = this.noteService.getAll();
    this.blockService.initialize(notes);
  }
}
