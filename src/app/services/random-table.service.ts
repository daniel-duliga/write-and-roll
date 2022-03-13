import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { DbService } from '../database/db.service';
import { RandomTable } from '../models/random-table';

@Injectable({
  providedIn: 'root'
})
export class RandomTableService {
  constructor(
    private db: DbService,
    private papa: Papa,
  ) { }

  async get(id: string): Promise<RandomTable> {
    const note = await this.db.notes.get(id);
    const content = this.papa.parse(note.content).data;
    return new RandomTable(content);
  }
}
