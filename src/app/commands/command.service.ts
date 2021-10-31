import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditorComponent } from '../components/editor/editor.component';
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
  editorComponent!: EditorComponent;

  constructor(
    private actionEntityService: ActionEntityService,
    private actionService: ActionsService,
    private randomTableEntityService: RandomTableEntityService,
  ) { }

  async handleCommandSelected(dialog: MatDialog, option: string): Promise<string> {
    let result = option;
    switch (option) {
      case '🔥 Roll Action': {
        return await this.executeRollActionCommand(dialog);
      }
      case '🎲 Roll Dice': {
        return await this.executeRollDiceCommand();
      }
      case '🎱 Roll Table': {
        return await this.executeRollTableCommand();
      }
      default: {
        return result;
      }
    }
  }

  async executeRollActionCommand(dialog: MatDialog): Promise<string> {
    const actions = this.actionEntityService.getAllPaths();
    const actionName = await this.editorComponent.prompt(actions);
    const action = this.actionEntityService.get(actionName);
    return this.actionService.run(action.rawContent, dialog);
  }

  async executeRollDiceCommand(): Promise<string> {
    const formula = await this.editorComponent.promptInput();
    return DiceUtil.rollDiceFormula(formula).toString();
  }

  async executeRollTableCommand(): Promise<string> {
    const tables = this.randomTableEntityService.getAllPaths();
    const tableName = await this.editorComponent.prompt(tables);
    const table = this.randomTableEntityService.get(tableName);
    return TablesUtil.rollOnTable(table.content);
  }
}
