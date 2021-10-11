import { IEntity } from "./IEntity";

export class StorageServiceBase {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  create(path: string, content: any) {
    localStorage.setItem(`${this.collectionName}/${path}`, JSON.stringify(content));
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

  get(path: string): IEntity | null {
    let entity: IEntity | null = null;
    const rawContent = localStorage.getItem(`${this.collectionName}/${path}`);
    if (rawContent) {
      entity = JSON.parse(rawContent);
    }
    return entity;
  }

  delete(path: string) {
    return localStorage.removeItem(`${this.collectionName}/${path}`);
  }
}
