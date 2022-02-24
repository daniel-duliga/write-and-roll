import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { Action } from './action';
import { Note } from '../storage/notes/note';
import { Block } from './block';
import { BlockList } from './blockList';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  public actions: BlockList;
  public randomTables: BlockList;

  constructor(
    private papa: Papa,
  ) {
    this.actions = new BlockList();
    this.randomTables = new BlockList();
  }

  initialize(notes: Note[]) {
    for (const note of notes) {
      this.removeNoteBlocks(note.name);
      this.processNoteContent(note);
    }
  }
  processNoteContent(note: Note) {
    this.removeNoteBlocks(note.name);
    const lines = note.content.split('\n');
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      if(!line.startsWith('```')) {
        continue;
      }
      
      const lineSegments = line.split(' ').filter(x => x !== '');
      lineSegments.shift();
      
      const type = lineSegments.shift();
      if(!type) {
        continue;
      }
      
      let name = '';
      for (const lineSegment of lineSegments) {
        name = name.concat(lineSegment).concat(' ');
      }
      name = name.trim();

      let content = '';
      for (let nextLineIndex = index + 1; nextLineIndex < lines.length; nextLineIndex++) {
        const nextLine = lines[nextLineIndex];
        if(nextLine.trimEnd() === '```') {
          break;
        } else {
          content = content.concat(nextLine).concat('\n');
        }
      }
      content = content.trim();
      
      switch (type) {
        case "action": {
          this.actions.addBlock(new Block(note.name, new Action(name, content)));
          break;
        }
        case "table": {
          this.randomTables.addBlock(new Block(note.name, new RandomTable(name, this.papa.parse(content).data)));
          break;
        }
        default: {
          console.log(`Found unknown type ${type}.`);
        }
      }
    }
  }
  removeNoteBlocks(noteName: string) {
    this.actions.removeBlocksByNote(noteName);
    this.randomTables.removeBlocksByNote(noteName);
  }
}
