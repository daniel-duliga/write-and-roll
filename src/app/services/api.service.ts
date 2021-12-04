import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../components/prompts/prompt.service';
import { RandomTableEntityService } from '../entities/services/random-table-entity.service';
import { DiceUtil } from '../trpg/dice/dice.util';
import { TablesUtil } from '../trpg/tables.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dialog: MatDialog | null = null;

  constructor(
    private randomTableEntityService: RandomTableEntityService,
    private promptService: PromptService,
  ) { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }

  rollTable(tableName: string): string {
    const table = this.randomTableEntityService.get(tableName);
    if (table) {
      return TablesUtil.rollOnTable(table.parsedContent);
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
