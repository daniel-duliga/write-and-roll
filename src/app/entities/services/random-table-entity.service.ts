import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from '../models/random-table';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class RandomTableEntityService extends EntityService {
  constructor(private papa: Papa) {
    super('random-tables');
  }

  get(name: string): RandomTable | null {
    const entity = super.get(name);
    if (entity) {
      const randomTable = new RandomTable(entity.name, entity.rawContent);
      if (entity.rawContent) {
        randomTable.content = this.papa.parse(entity.rawContent).data;
      }
      return randomTable;
    } else {
      return null;
    }
  }
}
