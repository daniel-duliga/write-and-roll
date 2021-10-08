import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from '../wrappers/RandomTable';
import { StorageServiceBase } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RandomTableService extends StorageServiceBase {
  constructor(private papa: Papa) {
    super('tables');
  }

  create(path: string, content: string): void {
    this.papa.parse(content, {
      complete: content => super.create(path, content)
    });
  }

  get(path: string): RandomTable {
    const content = super.get(path);
    return new RandomTable(path, this.getName(path), this.papa.unparse(content), JSON.parse(content));
  }

  getName(path: string): string {
    return path.replace(`${this.collectionName}/`, '');
  }
}
