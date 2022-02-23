import { Note } from "./note";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  collectionName = 'notes';

  constructor() { }

  create(note: Note) {
    localStorage.setItem(`${this.collectionName}/${note.path}`, JSON.stringify(note));
  }
  
  getAll(): Note[] {
    const result: Note[] = [];
    
    const paths = Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/`))
      .map(x => x.replace(`${this.collectionName}/`, ''))
      .sort((a, b) => a.localeCompare(b));

    for (const path of paths) {
      let note = this.get(path);
      if (note) {
        result.push(note);
      }
    }
    
    return result;
  }
  
  get(path: string): Note | null {
    let result: Note | null = null;

    const rawContent = localStorage.getItem(`${this.collectionName}/${path}`);
    if (rawContent !== null) {
      const rawNote: Note = JSON.parse(rawContent); 
      result = new Note(rawNote.path, rawNote.content, rawNote.favorite);
    }

    return result;
  }
  
  update(note: Note) {
    let existingNote = this.get(note.path);
    if (existingNote) {
      localStorage.setItem(`${this.collectionName}/${note.path}`, JSON.stringify(note));
    }
  }
  
  rename(oldPath: string, newPath: string) {
    let item = this.get(oldPath);
    if (item) {
      const oldPath = item.path;
      this.delete(oldPath);
      item.path = newPath;
      this.create(item);
    }
  }
  
  delete(path: string) {
    localStorage.removeItem(`${this.collectionName}/${path}`);
  }
}
