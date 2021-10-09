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

  create(path: string, content: string) {
    this.papa.parse(content, {
      complete: content => super.create(path, content)
    });
  }

  get(path: string): RandomTableWrapper {
    const content = JSON.parse(super.get(path));
    let rawContent = '';
    if (content) {
      rawContent = this.papa.unparse(content);
    } else {
      path = path.concat('/');
    }
    return new RandomTableWrapper(path, this.getName(path), rawContent, content);
  }

  getName(path: string): string {
    return path.replace(`${this.collectionName}/`, '');
  }
}
