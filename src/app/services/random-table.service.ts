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
    private papa: Papa,
  ) { }

  async getAll(): Promise<RandomTable[]> {
    return this.db.randomTables.getAll();
  }
}
