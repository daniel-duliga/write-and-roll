import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTableWrapper } from './random-table.wrapper';
import { StorageServiceBase } from '../storage.service';

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

  get(path: string): RandomTableWrapper {
    const content = super.get(path);
    return new RandomTableWrapper(path, this.getName(path), this.papa.unparse(content), JSON.parse(content));
  }

  getName(path: string): string {
    return path.replace(`${this.collectionName}/`, '');
  }
}
