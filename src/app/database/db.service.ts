import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { SystemNoteRepository as SystemNotesRepository } from './repositories/system-note-repository';
import { RootEntityRepository } from './repositories/generic/root-entity-repository';
import { Campaign } from './models/campaign';
import { System } from './models/system';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: PouchDB.Database = new PouchDB('write-and-roll-db');
  
  campaigns: RootEntityRepository<Campaign> = new RootEntityRepository(this.db, 'campaigns');
  systems: RootEntityRepository<System> = new RootEntityRepository(this.db, 'systems');
  systemNotes: SystemNotesRepository = new SystemNotesRepository(this.db);

  constructor() { }

  onChanges() {
    return this.db.changes({
      since: 'now',
      live: true,
    });
  }
}
