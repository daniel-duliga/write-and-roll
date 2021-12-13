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
    private newEntityService: BlockService,
    private noteService: NoteService,
  ) { }

  ngOnInit(): void {
    const chronicles = this.noteService.getAllNonEmpty();
    this.newEntityService.initialize(chronicles);
  }
}
