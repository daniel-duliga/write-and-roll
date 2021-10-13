import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../components/prompts/prompt.service';
import { RandomTableStorageService } from '../storage/random-table/random-table-storage.service';
import { DiceUtil } from '../trpg/dice/dice.util';
import { TablesUtil } from '../trpg/tables.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dialog: MatDialog | null = null;

  constructor(
    private randomTableStorageService: RandomTableStorageService,
    private promptService: PromptService,
  ) { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }

  rollTable(tableName: string): string {
    const table = this.randomTableStorageService.get(tableName);
    return TablesUtil.rollOnTable(table.jsonContent);
  }

  prompt(message: string): Promise<string> | null {
    if(this.dialog) {
      return this.promptService.openInputPrompt(this.dialog, message);
    } else {
      return null;
    }
  }
}
