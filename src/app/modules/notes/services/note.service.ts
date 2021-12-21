import { Editor } from "../models/editor";
import { Note } from "../models/note";
import { ExpansionModelItem } from "../models/expansion-model-item";
import { BlockService } from "../../blocks/block.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  collectionName = 'notes';

  constructor(
    private blockService: BlockService
  ) { }

  //#region crud
  create(note: Note) {
    localStorage.setItem(`${this.collectionName}/data/${note.path}`, note.content);
  }
  getAll(): Note[] {
    const result: Note[] = [];
    
    const paths = Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/data/`))
      .map(x => x.replace(`${this.collectionName}/data/`, ''))
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

    const rawContent = localStorage.getItem(`${this.collectionName}/data/${path}`);
    if (rawContent !== null) {
      result = new Note(path, rawContent);
    }

    return result;
  }
  update(note: Note) {
    let existingNote = this.get(note.path);
    if (existingNote) {
      localStorage.setItem(`${this.collectionName}/data/${note.path}`, note.content);
      this.blockService.addBlocksFromNote(note);
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
    localStorage.removeItem(`${this.collectionName}/data/${path}`);
    this.blockService.removeBlocksByNote(path);
  }
  //#endregion

  //#region opened entities
  addOpenedEditor(editor: Editor) {
    const openedEditors = this.getOpenedEditors();
    if (!openedEditors.find(x => x.notePath === editor.notePath)) {
      openedEditors.push(editor);
      localStorage.setItem(`${this.collectionName}/openedEditors`, JSON.stringify(openedEditors));
    }
  }
  updateOpenedEditor(editor: Editor) {
    this.removeOpenEditor(editor);
    this.addOpenedEditor(editor);
  }
  removeOpenEditor(editor: Editor) {
    let openedEditors = this.getOpenedEditors();
    openedEditors = openedEditors.filter(x => x.notePath !== editor.notePath);
    localStorage.setItem(`${this.collectionName}/openedEditors`, JSON.stringify(openedEditors));
  }
  getOpenedEditors(): Editor[] {
    let result: Editor[] = [];
    let rawResult = localStorage.getItem(`${this.collectionName}/openedEditors`);
    if (rawResult) {
      result = JSON.parse(rawResult);
    }
    return result;
  }
  //#endregion

  ensureDefaultNotesCreated() {
    const flagKey = 'notes/defaultNotesCreated';
    let flag = localStorage.getItem(flagKey);
    if(!flag) {
      this.create(new Note('Home', '# 📝 Docs\n## 🚀 Getting started\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas sit amet libero euismod laoreet. Mauris eu ipsum lorem. Integer sed posuere ex, sit amet lobortis purus. Suspendisse fermentum quam a lacus varius, non rutrum quam mattis. Sed id vestibulum nibh, et placerat tortor. Quisque congue faucibus felis sed iaculis. Praesent maximus felis sem, sit amet lobortis enim venenatis semper. Praesent vel elementum est, eget rhoncus elit. Donec orci nibh, venenatis eu maximus non, ullamcorper eget libero. Ut dictum vitae nulla nec maximus. In ultrices lacus sit amet erat laoreet dictum. Ut ligula ipsum, fringilla sit amet convallis vel, elementum non tellus. Nam felis enim, mollis sit amet nibh nec, sagittis tempor metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam feugiat at massa vel fermentum.'));
      
      localStorage.setItem(flagKey, 'true');
    }
  }
}
