import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RandomTableService } from 'src/app/services/random-table.service';
import { DiceUtil } from '../dice/dice.util';
import { Context } from './context';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dialog!: MatDialog;
  context: Context = new Context('');

  constructor(
    // private promptService: PromptService,
    private randomTableService: RandomTableService,
  ) { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }

  async rollTable(id: string): Promise<string> {
    const table = await this.randomTableService.get(id);
    if (table) {
      return ''; // TablesUtil.rollOnTable(table.content);
    } else {
      return `Table ${id} not found`;
    }
  }

  async getAttribute(name: string): Promise<number | string> {
    let value = this.context.getAttribute(name);
    if(!value) {
      // value = await this.promptService.input(this.dialog, name);
    }
    if(isNaN(value)) {
      return value;
    } else {
      return +value;
    }
  }
  setAttribute(key: string, value: string) {
    this.context.setAttribute(key, value);
  }

  async prompt(message: string): Promise<string> {
    return ''; // await this.promptService.input(this.dialog, message);
  }

  async rollAction(action: string): Promise<string> {
    // this is a placeholder meant to be overridden in ActionService
    return '';
  }
}
