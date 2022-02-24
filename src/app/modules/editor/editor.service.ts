import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private collectionName = 'editors';

  private openEditors: string[] = [];

  constructor() {
    let rawResult = localStorage.getItem(`${this.collectionName}/openEditors`);
    if (rawResult) {
      const parsedResult = JSON.parse(rawResult);
      if (parsedResult) {
        this.openEditors = parsedResult;
      }
    }
  }

  // open editors
  getOpenEditors(): string[] {
    return this.openEditors;
  }
  addOpenedEditor(name: string) {
    if (!this.openEditors.includes(name)) {
      this.openEditors.push(name);
      this.persistOpenEditors();
    }
  }
  removeOpenedEditor(name: string) {
    const index = this.openEditors.indexOf(name);
    if (index === -1) { return; }

    this.openEditors = this.openEditors.filter(x => x !== name);
    this.persistOpenEditors();

    // set the next editor as the focused one
    if (this.openEditors.length > 0) {
      if (name === this.getFocusedEditor()) {
        if (index === this.openEditors.length) {
          this.setFocusedEditor(this.openEditors[index - 1]);
        } else {
          this.setFocusedEditor(this.openEditors[index]);
        }
      }
    } else {
      this.setFocusedEditor('');
    }
  }
  updateOpenedEditor(oldName: string, newName: string) {
    const index = this.openEditors.indexOf(oldName);
    if (index !== -1) {
      this.openEditors[index] = newName;
      this.persistOpenEditors();
    }
  }
  openEditorExists(name: string): boolean {
    return this.openEditors.includes(name);
  }

  // focused editor
  setFocusedEditor(name: string) {
    localStorage.setItem(`${this.collectionName}/focusedEditor`, name);
  }
  getFocusedEditor(): string {
    return localStorage.getItem(`${this.collectionName}/focusedEditor`) ?? '';
  }

  // private methods
  private persistOpenEditors() {
    localStorage.setItem(`${this.collectionName}/openEditors`, JSON.stringify(this.openEditors));
  }
}
