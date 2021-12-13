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

  getAllNonEmpty(): Note[] {
    const result: Note[] = [];
    const paths = this.getAllNonEmptyPaths();
    for (const path of paths) {
      let note = this.get(path);
      if(note) {
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

  delete(path: string) {
    localStorage.removeItem(`${this.collectionName}/data/${path}`);
    this.blockService.removeBlocksByNote(path);
  }

  update(note: Note) {
    let existingNote = this.get(note.path);
    if(existingNote) {
      localStorage.setItem(`${this.collectionName}/data/${note.path}`, note.content);
      this.blockService.addBlocksFromNote(note);
    }
  }
  //#endregion

  //#region paths
  getAllPaths(): string[] {
    return Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/data/`))
      .map(x => x.replace(`${this.collectionName}/data/`, ''))
      .sort((a, b) => a.localeCompare(b));
  }

  getAllNonEmptyPaths(): string[] {
    return Object
      .keys(localStorage)
      .filter(x => 
        x.startsWith(`${this.collectionName}/data/`) &&
        localStorage[x] !== ''
      ).map(x => x.replace(`${this.collectionName}/data/`, ''))
      .sort((a, b) => a.localeCompare(b));
  }
  //#endregion

  move(oldPath: string, newPath: string) {
    let item = this.get(oldPath);
    if (item) {
      const oldPath = item.path;
      this.delete(oldPath);
      item.path = newPath;
      this.create(item);
    }
  }

  //#region children
  getDescendantsRecursive(parentPath: string): Note[] {
    const result: Note[] = [];

    const childPaths = Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/data/${parentPath}/`))
      .map(x => x.replace(`${this.collectionName}/data/`, ''));

    for (const childPath of childPaths) {
      const child = this.get(childPath);
      if(child) {
        result.push(child);
      }
    }

    return result;
  }
  //#endregion

  //#region expansion model
  getExpansionModel(): ExpansionModelItem[] {
    let result: ExpansionModelItem[] = [];
    const rawExpansionModel = localStorage.getItem(`${this.collectionName}/expansionModel`);
    if (rawExpansionModel) {
      result = JSON.parse(rawExpansionModel);
    }
    return result;
  }

  setExpansionModel(item: ExpansionModelItem) {
    const expansionModel = this.getExpansionModel();
    const existingItem = expansionModel.find(x => x.identifier == item.identifier);
    if (existingItem) {
      existingItem.isExpanded = item.isExpanded;
    } else {
      expansionModel.push(new ExpansionModelItem(item.identifier, item.isExpanded));
    }
    localStorage.setItem(`${this.collectionName}/expansionModel`, JSON.stringify(expansionModel));
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
}
