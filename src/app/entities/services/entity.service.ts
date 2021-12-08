import { Editor } from "../models/editor";
import { Item } from "../models/item";
import { ExpansionModelItem } from "../models/expansion-model-item";

export class EntityService {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  //#region crud
  create(item: Item): Item | null {
    localStorage.setItem(`${this.collectionName}/data/${item.path}`, item.content);
    return this.get(item.path);
  }

  getAllNonEmpty(): Item[] {
    const result: Item[] = [];
    const paths = this.getAllNonEmptyPaths();
    for (const path of paths) {
      let item = this.get(path);
      if(item) {
        result.push(item);
      }
    }
    return result;
  }

  get(path: string): Item | null {
    let result: Item | null = null;

    const rawContent = localStorage.getItem(`${this.collectionName}/data/${path}`);
    if (rawContent !== null) {
      result = new Item(path, rawContent);
    }

    return result;
  }

  delete(path: string) {
    return localStorage.removeItem(`${this.collectionName}/data/${path}`);
  }

  update(item: Item) {
    let existingItem = this.get(`${this.collectionName}/data/${item.path}`);
    if(existingItem) {
      if(!item.content) {
        item.content = '\n';
      }
      localStorage.setItem(item.path, item.content)
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
  getDescendantsRecursive(parentPath: string): Item[] {
    const result: Item[] = [];

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
    if (!openedEditors.find(x => x.entityId === editor.entityId)) {
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
    openedEditors = openedEditors.filter(x => x.entityId !== editor.entityId);
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
