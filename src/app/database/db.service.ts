import { Injectable } from '@angular/core';
import { NotRepository } from './repositories/note-repository';
import PouchDb from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db = new PouchDb('write-and-roll-db');
  
  notes: NotRepository = new NotRepository(this.db, 'notes');

  constructor() {
    this.db.createIndex({
      index: {fields: ['name', 'type']}
    });
  }

  onChanges() {
    return this.db.changes({
      since: 'now',
      live: true,
    });
  }
}
