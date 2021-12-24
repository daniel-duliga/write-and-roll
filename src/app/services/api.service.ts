import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../components/prompts/prompt.service';
import { BlockService } from '../modules/blocks/block.service';
import { RandomTable } from '../modules/blocks/random-table';
import { DiceUtil } from '../modules/trpg/dice/dice.util';
import { TablesUtil } from '../modules/trpg/tables.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dialog: MatDialog | null = null;

  constructor(
    private blockService: BlockService,
    private promptService: PromptService,
  ) { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }

  rollTable(tableName: string): string {
    const table = this.blockService.randomTables.getByFriendlyName(tableName)?.content as RandomTable | null;
    if (table) {
      return TablesUtil.rollOnTable(table.content);
    } else {
      return `Table ${tableName} not found`;
    }
  }

  prompt(message: string): Promise<string> | null {
    if (this.dialog) {
      return this.promptService.input(this.dialog, message);
    } else {
      return null;
    }
  }
}
