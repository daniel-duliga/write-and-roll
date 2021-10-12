import { Injectable } from '@angular/core';
import { RandomTableStorageService } from '../storage/random-table/random-table-storage.service';
import { DiceUtil } from '../trpg/dice/dice.util';
import { TablesUtil } from '../trpg/tables.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private randomTableStorageService: RandomTableStorageService
  ) { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }

  rollTable(tableName: string): string {
    const table = this.randomTableStorageService.get(tableName);
    return TablesUtil.rollOnTable(table.jsonContent);
  }
}
