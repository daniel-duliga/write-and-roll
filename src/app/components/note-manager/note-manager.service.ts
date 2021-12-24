import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Editor } from 'src/app/modules/notes/models/editor';

@Injectable({
  providedIn: 'root'
})
export class NoteManagerService {
  collectionName = 'editors';

  public openNotes: Subject<string> = new Subject<string>();

  constructor() { }

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
}
