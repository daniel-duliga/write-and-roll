import { Entity } from "../models/entity";
import { ExpansionModelItem } from "../models/expansion-model-item";

export class EntityService {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  //#region crud
  create(path: string, content: string): Entity | null {
    // Ensure content ends with new line
    if (!content.endsWith('\n')) {
      content = content.concat('\n');
    }
    // Save
    localStorage.setItem(`${this.collectionName}/data/${path}`, content);
    return this.get(path);
  }

  getAll(includeParents: boolean = false): string[] {
    let result = this.getLeaves();
    if (includeParents) {
      const parents = this.getParentsByLeaves(result);
      result = result.concat(parents);
      result = result.sort((a, b) => a.localeCompare(b));
    }

    return result;
  }

  getAllParents(): string[] {
    const leaves = this.getAll(false);
    return this.getParentsByLeaves(leaves);
  }

  get(name: string): Entity | null {
    let result: Entity | null = null;

    const rawContent = localStorage.getItem(`${this.collectionName}/data/${name}`);
    if (rawContent) {
      result = new Entity(name, rawContent);
    }

    return result;
  }

  delete(name: string) {
    return localStorage.removeItem(`${this.collectionName}/data/${name}`);
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
  addOpenedEntity(entity: string) {
    const openedEntities = this.getOpenedEntities();
    if (!openedEntities.includes(entity)) {
      openedEntities.push(entity);
      localStorage.setItem(`${this.collectionName}/openedEntities`, JSON.stringify(openedEntities));
    }
  }

  removeOpenEntity(entity: string) {
    let openedEntities = this.getOpenedEntities();
    openedEntities = openedEntities.filter(x => x !== entity);
    localStorage.setItem(`${this.collectionName}/openedEntities`, JSON.stringify(openedEntities));
  }

  getOpenedEntities(): string[] {
    let result: string[] = [];
    let rawResult = localStorage.getItem(`${this.collectionName}/openedEntities`);
    if (rawResult) {
      result = JSON.parse(rawResult);
    }
    return result;
  }
  //#endregion

  //#region private methods
  private getLeaves() {
    return Object
      .keys(localStorage)
      .filter(x => x.startsWith(`${this.collectionName}/data/`))
      .map(x => x.replace(`${this.collectionName}/data/`, ''))
      .sort((a, b) => a.localeCompare(b));
  }

  private getParentsByLeaves(leafPaths: string[]): string[] {
    let result: string[] = [];
    for (const leafPath of leafPaths) {
      let segments = leafPath.split('/');
      segments = segments.slice(0, segments.length - 1).reverse();
      let newPath = '';
      while (segments.length > 0) {
        let segment = segments.pop();
        if (segment) {
          newPath = newPath.concat(segment, '/');
          if (!result.includes(newPath)) {
            result.push(newPath);
          }
        }
      }
    }
    result = result.sort((a, b) => a.localeCompare(b));
    return result;
  }
  //#endregion
}
