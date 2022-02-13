import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../../components/prompts/prompt.service';
import { BlockService } from '../blocks/block.service';
import { RandomTable } from '../blocks/random-table';
import { DiceUtil } from '../trpg/dice/dice.util';
import { TablesUtil } from '../trpg/tables.util';
import { Context } from './context';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dialog!: MatDialog;
  context: Context = new Context('');

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

  async getAttribute(name: string): Promise<string> {
    let value = this.context.getAttribute(name);
    if(!value) {
      value = await this.promptService.input(this.dialog, name);
    }
    return value;
  }

  async prompt(message: string): Promise<string> {
    return await this.promptService.input(this.dialog, message);
  }

  async runAction(action: string): Promise<string> {
    // this is a placeholder meant to be overridden in ActionService
    return '';
  }
}
