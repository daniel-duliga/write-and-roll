import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb';
import { Repository } from './core/repository';
import { RandomTable } from './models/random-table';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  
  private db = new PouchDb('write-and-roll-db');
  randomTables: Repository<RandomTable> = new Repository(this.db, 'randomTables');

  constructor() {
    this.db.createIndex({
      index: {fields: ['name']}
    });
  }

  onChanges() {
    return this.db.changes({
      since: 'now',
      live: true,
    });
  }

}
