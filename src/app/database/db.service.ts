import { Injectable } from '@angular/core';
import { NotRepository } from './repositories/note-repository';
import PouchDb from 'pouchdb';
import { Repository } from './core/repository';
import { Editor } from './models/editor';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db = new PouchDb('write-and-roll-db');
  
  notes: NotRepository = new NotRepository(this.db, 'notes');
  editors: Repository<Editor> = new Repository(this.db, 'openEditors');

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
