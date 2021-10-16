import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from '../models/random-table';
import { StorageServiceBase } from '../core/storage-service-base';

@Injectable({
  providedIn: 'root'
})
export class RandomTableStorageService extends StorageServiceBase {
  constructor(private papa: Papa) {
    super('random-tables');
  }

  get(name: string): RandomTable {
    const entity = super.get(name);
    const randomTable = new RandomTable(entity.name, entity.rawContent);
    if (entity.rawContent) {
      randomTable.content = this.papa.parse(entity.rawContent).data;
    }
    return randomTable;
  }
}
