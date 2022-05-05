import { Injectable } from '@angular/core';
import { DbService } from '../database/db.service';
import { RandomTable, RandomTableLine } from '../database/models/random-table';
import { DiceUtil } from '../modules/dice/dice.util';

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

  roll(randomTable: RandomTable): string {
    const max = getMaxIndex(randomTable.lines);
    const roll = DiceUtil.rollDice(1, max);
    const match = randomTable.lines.find(x => checkMatch(x.index, roll[0]));
    if (match) {
        return match.value;
    } else {
        return '';
    }

    function getMaxIndex(lines: RandomTableLine[]): number {
      let result = 0;
  
      let max: string = lines[lines.length - 1].index;
      if (max.includes('-')) {
          max = max.split('-')[1];
      }
  
      if (max === '00') {
          result = 100;
      } else {
          result = +max;
      }
  
      return result;
  }
  
  function checkMatch(index: string, roll: number): boolean {
      if (index.includes('-')) {
          const ranges = index.split('-').map(x => +x)
          return ranges[0] <= roll && roll <= ranges[1]
      } else {
          return index === roll.toString()
      }
  }
  }

}
