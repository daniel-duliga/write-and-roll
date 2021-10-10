import { Injectable } from '@angular/core';
import { StorageServiceBase } from '../storage.service';
import { JournalWrapper } from './journal.wrapper';

@Injectable({
  providedIn: 'root'
})
export class JournalService extends StorageServiceBase {
  constructor() {
    super('journal');
  }

  get(name: string): JournalWrapper {
    let result = new JournalWrapper(name);
    const existingJournal: JournalWrapper = JSON.parse(super.get(name));
    if (existingJournal) {
      result.content = existingJournal.content;
    } else {
      result.name = `${name}/`;
    }
    return result;
  }
}
