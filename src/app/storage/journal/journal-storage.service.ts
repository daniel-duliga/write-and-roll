import { Injectable } from '@angular/core';
import { StorageServiceBase } from '../storage.service';
import { JournalWrapper } from './journal.wrapper';

@Injectable({
  providedIn: 'root'
})
export class JournalStorageService extends StorageServiceBase {
  constructor() {
    super('journal');
  }

  get(name: string): JournalWrapper {
    let result = new JournalWrapper(name);
    const entity = super.get(name);
    if (entity) {
      result.rawContent = entity.rawContent;
    } else {
      result.name = `${name}/`;
    }
    return result;
  }
}
