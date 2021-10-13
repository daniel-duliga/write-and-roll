import { IEntity } from "./IEntity";

export class StorageServiceBase {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  create(path: string, content: string) {
    localStorage.setItem(`${this.collectionName}/${path}`, content);
  }

  getAllPaths(): string[] {
    return Object
      .keys(localStorage)
      .filter(x => x.startsWith(this.collectionName))
      .map(x => x.replace(`${this.collectionName}/`, ''))
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

  get(name: string): IEntity {
    let entity: IEntity | null = null;
    const rawContent = localStorage.getItem(`${this.collectionName}/${name}`);
    if (rawContent) {
      entity = {
        name: name,
        rawContent: rawContent
      };
    } else {
      entity = {
        name: `${name}/`,
        rawContent: ''
      };
    }
    return entity;
  }

  getNameWithoutCollection(name: string): string {
    return name.replace(`${this.collectionName}/`, '');
  }

  delete(name: string) {
    return localStorage.removeItem(`${this.collectionName}/${name}`);
  }
}
