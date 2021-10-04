export class StorageServiceBase {
  collectionName = 'tables';

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  create(name: string, content: string): void {
    localStorage.setItem(`${this.collectionName}/${name}`, JSON.stringify(content));
  }

  getAll(): string[] {
    return Object.keys(localStorage).filter(x => x.startsWith(this.collectionName));
  }
}
