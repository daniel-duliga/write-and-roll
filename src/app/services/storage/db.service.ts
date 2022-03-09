import { Injectable } from '@angular/core';
import { Campaign } from './models/campaign';
import { Repository } from './repository';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: PouchDB.Database = new PouchDB('write-and-roll-db');
  
  campaigns: Repository<Campaign> = new Repository(this.db, 'campaigns');

  constructor() { }

  onChanges() {
    return this.db.changes({
      since: 'now',
      live: true,
    });
  }
}
