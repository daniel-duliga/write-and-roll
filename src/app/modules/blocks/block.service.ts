import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { Action } from './action';
import { Note } from '../../modules/notes/models/note';
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

  //#region public methods
  initialize(notes: Note[]) {
    for (const note of notes) {
      this.removeBlocksByNote(note.path);
      this.addBlocksFromNote(note);
    }
  }

  addBlocksFromNote(note: Note) {
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
      
      switch (type) {
        case "action": {
          this.actions.addBlock(new Block(note.path, new Action(name, content)));
          break;
        }
        case "table": {
          this.randomTables.addBlock(new Block(note.path, new RandomTable(name, this.papa.parse(content).data)));
          break;
        }
        default: {
          console.log(`Found unknown type ${type}.`);
        }
      }
    }
  }

  removeBlocksByNote(noteName: string) {
    this.actions.removeBlocksByNote(noteName);
    this.randomTables.removeBlocksByNote(noteName);;
  }
  //#endregion
}
