export class StorageServiceBase {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  create(path: string, content: any): void {
    localStorage.setItem(`${this.collectionName}/${path}`, JSON.stringify(content));
  }

  getAll(): string[] {
    return Object
      .keys(localStorage)
      .filter(x => x.startsWith(this.collectionName))
      .map(x => x.replace(`${this.collectionName}/`, ''));
  }

  get(path: string): any | null {
    return localStorage.getItem(`${this.collectionName}/${path}`);
  }

  delete(path: string): void {
    return localStorage.removeItem(`${this.collectionName}/${path}`);
  }
}
