import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../components/prompts/prompt.service';
import { RandomTableStorageService } from '../storage/model-services/random-table-storage.service';
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
    if (table) {
      return TablesUtil.rollOnTable(table.content);
    } else {
      return `Table ${tableName} not found`;
    }
  }

  prompt(message: string): Promise<string> | null {
    if (this.dialog) {
      return this.promptService.openInputPrompt(this.dialog, message);
    } else {
      return null;
    }
  }
}
