import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTableWrapper } from './random-table.wrapper';
import { StorageServiceBase } from '../storage.service';
import { IEntity } from '../IEntity';

@Injectable({
  providedIn: 'root'
})
export class RandomTableStorageService extends StorageServiceBase {
  constructor(private papa: Papa) {
    super('tables');
  }

  get(name: string): RandomTableWrapper {
    const entity = super.get(name);
    const randomTable = new RandomTableWrapper(entity.name, entity.rawContent);
    if (entity.rawContent) {
      randomTable.content = this.papa.parse(entity.rawContent).data;
    }
    return randomTable;
  }
}
