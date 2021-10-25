import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptService } from '../components/prompts/prompt.service';
import { ActionEntityService } from '../entities/services/action-entity.service';
import { RandomTableEntityService } from '../entities/services/random-table-entity.service';
import { ActionsService } from '../pages/actions/actions.service';
import { DiceUtil } from '../trpg/dice/dice.util';
import { TablesUtil } from '../trpg/tables.util';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  commands = [
    '🎱 Roll Table',
    '🔥 Roll Action',
    '🎲 Roll Dice',
  ];

  constructor(
    private promptService: PromptService,
    private actionEntityService: ActionEntityService,
    private actionService: ActionsService,
    private randomTableEntityService: RandomTableEntityService,
  ) { }

  async showCommands(dialog: MatDialog): Promise<string> {
    const command = await this.promptService.openAutoCompletePrompt(dialog, "Command", this.commands);
    return await this.handleCommandSelected(dialog, command);
  }

  async handleCommandSelected(dialog: MatDialog, option: string): Promise<string> {
    let result = option;
    switch (option) {
      case '🔥 Roll Action': {
        return await this.executeRollActionCommand(dialog);
      }
      case '🎲 Roll Dice': {
        return await this.executeRollDiceCommand(dialog);
      }
      case '🎱 Roll Table': {
        return await this.executeRollTableCommand(dialog);
      }
      default: {
        return result;
      }
    }
  }

  async executeRollActionCommand(dialog: MatDialog): Promise<string> {
    const actions = this.actionEntityService.getAllPaths();
    const actionName = await this.promptService.openAutoCompletePrompt(dialog, "Action", actions);
    const action = this.actionEntityService.get(actionName);
    return this.actionService.run(action.rawContent, dialog);
  }

  async executeRollDiceCommand(dialog: MatDialog): Promise<string> {
    const formula = await this.promptService.openInputPrompt(dialog, "Formula");
    return DiceUtil.rollDiceFormula(formula).toString();
  }

  async executeRollTableCommand(dialog: MatDialog): Promise<string> {
    const tables = this.randomTableEntityService.getAllPaths();
    const tableName = await this.promptService.openAutoCompletePrompt(dialog, "Table", tables);
    const table = this.randomTableEntityService.get(tableName);
    return TablesUtil.rollOnTable(table.content);
  }
}
