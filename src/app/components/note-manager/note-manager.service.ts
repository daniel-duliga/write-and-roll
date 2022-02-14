import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NoteEditor } from 'src/app/modules/notes/models/note-editor';

@Injectable({
  providedIn: 'root'
})
export class NoteManagerService {
  collectionName = 'editors';

  public requestOpen: Subject<string> = new Subject<string>();
  public requestClose: Subject<string> = new Subject<string>();
  public requestRename: Subject<string> = new Subject<string>();
  public requestFavorite: Subject<string> = new Subject<string>();
  public requestDelete: Subject<string> = new Subject<string>();
  public requestOpenLink: Subject<string> = new Subject<string>();

  constructor() { }

  addOpenedEditor(editor: NoteEditor) {
    const openedEditors = this.getOpenedEditors();
    if (!openedEditors.find(x => x.notePath === editor.notePath)) {
      openedEditors.push(editor);
      localStorage.setItem(`${this.collectionName}/openedEditors`, JSON.stringify(openedEditors));
    }
  }

  updateOpenedEditor(editor: NoteEditor) {
    this.removeOpenEditor(editor);
    this.addOpenedEditor(editor);
  }
  
  removeOpenEditor(editor: NoteEditor) {
    let openedEditors = this.getOpenedEditors();
    openedEditors = openedEditors.filter(x => x.notePath !== editor.notePath);
    localStorage.setItem(`${this.collectionName}/openedEditors`, JSON.stringify(openedEditors));
  }
  
  getOpenedEditors(): NoteEditor[] {
    let result: NoteEditor[] = [];
    let rawResult = localStorage.getItem(`${this.collectionName}/openedEditors`);
    if (rawResult) {
      result = JSON.parse(rawResult);
    }
    return result;
  }
}
