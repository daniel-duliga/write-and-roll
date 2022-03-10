import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { Campaign } from './models/campaign';
import { Note } from './models/note';
import { System } from './models/system';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: PouchDB.Database = new PouchDB('write-and-roll-db');
  
  campaigns: Repository<Campaign> = new Repository(this.db, 'campaigns');
  systems: Repository<System> = new Repository(this.db, 'systems');
  systemNotes: Repository<Note> = new Repository(this.db, 'system-notes');

  constructor() { }

  onChanges() {
    return this.db.changes({
      since: 'now',
      live: true,
    });
  }
}
