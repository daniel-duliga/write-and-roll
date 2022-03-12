import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionsService } from 'src/app/modules/actions/actions.service';
import { DiceUtil } from 'src/app/modules/trpg/dice/dice.util';
import { TablesUtil } from 'src/app/modules/trpg/tables.util';
import { AutoCompleteFieldComponent } from '../auto-complete-field/auto-complete-field.component';
import { PromptService } from '../prompts/prompt.service';
import { Context } from 'src/app/modules/actions/context';
import { DbService } from 'src/app/database/db.service';
import { RandomTableService } from 'src/app/services/random-table.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandResult: EventEmitter<string> = new EventEmitter();
  @Output() onAutoShow: EventEmitter<void> = new EventEmitter();
  
  @ViewChild('autoComplete') autoComplete!: AutoCompleteFieldComponent;
  
  commands = {
    rollAction: 'Roll Action',
    rollDice: 'Roll Dice',
    rollTable: 'Roll Table',
  };

  constructor(
    public dialog: MatDialog,
    private actionService: ActionsService,
    private promptService: PromptService,
    private db: DbService,
    private randomTableService: RandomTableService
  ) { }

  ngOnInit(): void { }

  // public methods
  public async showCommands(context: Context | null): Promise<void> {
    const command = await this.promptService.autocomplete(
      this.dialog,
      "Command",
      [
        this.commands.rollDice,
        this.commands.rollTable,
        this.commands.rollAction
      ]);
    await this.executeCommand(command, context, this.dialog);
  }

  // commands execution
  private async executeCommand(option: string, context: Context | null, dialog: MatDialog): Promise<void> {
    switch (option) {
      // Roll
      case this.commands.rollAction: {
        await this.executeRollActionCommand(context, dialog);
        break;
      }
      case this.commands.rollDice: {
        await this.executeRollDiceCommand();
        break;
      }
      case this.commands.rollTable: {
        await this.executeRollTableCommand();
        break;
      }
      default: {
        this.onCommandResult.emit('');
        break;
      }
    }
  }
  private async executeRollActionCommand(context: Context | null, dialog: MatDialog): Promise<void> {
    const actions = await this.db.notes.where({ type: "action" });
    
    const selectedActionId = await this.promptAutoComplete(actions.map(x => x._id));
    if(!selectedActionId) {
      this.onCommandResult.emit('');
      return;
    }
    
    const action = actions.find(x => x._id === selectedActionId);
    if(!action) {
      this.onCommandResult.emit('');
      return;
    }

    const result = await this.actionService.run(action.name, context, dialog);
    this.onCommandResult.emit(`${action.name}: ${result}`);
  }
  private async executeRollDiceCommand(): Promise<void> {
    const formula = await this.promptInput();
    const result = DiceUtil.rollDiceFormula(formula).toString();
    this.onCommandResult.emit(result);
  }
  private async executeRollTableCommand(): Promise<void> {
    const allTables = await this.db.notes.where({ type: "random-table" });
    const tableId = await this.promptAutoComplete(allTables.map(x => x._id));
    const table = await this.randomTableService.get(tableId);
    if (table) {
      const result = TablesUtil.rollOnTable(table.content);
      this.onCommandResult.emit(result);
    } else {
      console.log(`Random table '${tableId}' not found.`);
    }
  }

  // prompts
  private async promptInput(): Promise<string> {
    return await this.promptService.input(this.dialog, "", "");
  }
  private async promptAutoComplete(options: string[]): Promise<string> {
    return await this.promptService.autocomplete(this.dialog, "", options);
  }
}
