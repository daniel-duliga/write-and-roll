import { Component, OnInit } from '@angular/core';
import { BlockService } from './modules/blocks/block.service';
import { NoteStorageService } from './modules/storage/notes/note-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(
    private blockService: BlockService,
    private noteStorageService: NoteStorageService,
  ) { }

  ngOnInit(): void {
    // Blocks
    const notes = this.noteStorageService.getAll();
    this.blockService.initialize(notes);
  }
}
