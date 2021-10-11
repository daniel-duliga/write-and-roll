import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTableWrapper } from './random-table.wrapper';
import { StorageServiceBase } from '../storage.service';
import { IEntity } from '../IEntity';

@Injectable({
  providedIn: 'root'
})
export class RandomTableService extends StorageServiceBase {
  constructor(private papa: Papa) {
    super('tables');
  }

  create(path: string, entity: IEntity) {
    this.papa.parse(entity.rawContent, {
      complete: content => super.create(path, content)
    });
  }

  get(path: string): RandomTableWrapper {
    let csvContentParsed = '';
    const entity = super.get(path);
    if (entity) {
      csvContentParsed = this.papa.unparse(entity);
    } else {
      path = path.concat('/');
    }
    return new RandomTableWrapper(path, this.getName(path), csvContentParsed, entity);
  }

  getName(path: string): string {
    return path.replace(`${this.collectionName}/`, '');
  }
}
