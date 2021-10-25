import { Entity } from "../models/entity";
import { ExpansionModelItem } from "../models/expansion-model-item";

export class EntityService {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  create(path: string, content: string) {
    localStorage.setItem(`${this.collectionName}/data/${path}`, content);
  }

  getAllPaths(): string[] {
    return Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/data/`))
      .map(x => x.replace(`${this.collectionName}/data/`, ''))
      .sort((a, b) => a.localeCompare(b));
  }

  getAllFolderPaths(): string[] {
    const folders = this.getAllPaths().map((x) => {
      const segments = x.split('/');
      segments.pop();
      return segments.reduce((a, b) => a.concat('/', b));
    });
    const uniqueFolders = [...new Set(folders)];
    return uniqueFolders.map(x => x.concat('/'));
  }

  get(name: string): Entity {
    let entity: Entity | null = null;
    const rawContent = localStorage.getItem(`${this.collectionName}/data/${name}`);
    if (rawContent) {
      entity = new Entity(name, rawContent);
    } else {
      entity = new Entity(`${name}/`, '');
    }
    return entity;
  }

  getNameWithoutCollection(name: string): string {
    return name.replace(`${this.collectionName}/data/`, '');
  }

  delete(name: string) {
    return localStorage.removeItem(`${this.collectionName}/data/${name}`);
  }

  getExpansionModel(): ExpansionModelItem[] {
    let result: ExpansionModelItem[] = [];
    const rawExpansionModel = localStorage.getItem(`${this.collectionName}/expansionModel`);
    if (rawExpansionModel) {
      result = JSON.parse(rawExpansionModel);
    }
    return result;
  }

  setExpansionState(item: ExpansionModelItem) {
    const expansionModel = this.getExpansionModel();
    const existingItem = expansionModel.find(x => x.identifier == item.identifier);
    if (existingItem) {
      existingItem.isExpanded = item.isExpanded;
    } else {
      expansionModel.push(new ExpansionModelItem(item.identifier, item.isExpanded));
    }
    localStorage.setItem(`${this.collectionName}/expansionModel`, JSON.stringify(expansionModel));
  }
}
