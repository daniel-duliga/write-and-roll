import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { DbService } from '../database/db.service';
import { RandomTable } from '../database/models/random-table';

@Injectable({
  providedIn: 'root'
})
export class RandomTableService {
  
  constructor(
    private db: DbService,
  ) { }

  async create(randomTable: RandomTable): Promise<RandomTable> {
    return this.db.randomTables.create(randomTable);
  }

  async getAll(): Promise<RandomTable[]> {
    return this.db.randomTables.getAll();
  }

  async get(id: string): Promise<RandomTable> {
    return this.db.randomTables.get(id);
  }

  async update(randomTable: RandomTable): Promise<RandomTable> {
    return this.db.randomTables.update(randomTable);
  }

}
