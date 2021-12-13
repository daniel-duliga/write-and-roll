import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ActionsService } from 'src/app/services/actions.service';
import { DiceUtil } from 'src/app/modules/trpg/dice/dice.util';
import { TablesUtil } from 'src/app/modules/trpg/tables.util';
import { AutoCompleteFieldComponent } from '../auto-complete-field/auto-complete-field.component';
import { BlockService } from 'src/app/modules/blocks/block.service';
import { Action } from 'src/app/modules/blocks/action';
import { RandomTable } from 'src/app/modules/blocks/random-table';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandExecuted: EventEmitter<string> = new EventEmitter();

  @ViewChild('autoComplete') autoComplete!: AutoCompleteFieldComponent;

  commands = [
    '🎱 Roll Table',
    '🔥 Roll Action',
    '🎲 Roll Dice',
  ];
  commandSelected: Subject<string> = new Subject();
  mode: "commands" | "prompt" = "commands";

  constructor(
    public dialog: MatDialog,
    private actionService: ActionsService,
    private blockService: BlockService
  ) { }

  ngOnInit(): void {
  }

  //#region public methods
  public async commandsOptionChanged(command: string) {
    if (command) {
      if (this.mode === "commands") {
        const result = await this.handleCommandSelected(this.dialog, command);
        this.onCommandExecuted.emit(result);
        this.onCommandHandled();
      } else if (this.mode === "prompt") {
        this.commandSelected.next(command);
      }
    }
  }

  public focus() {
    this.autoComplete.autocompleteInput.nativeElement.focus();
  }
  //#endregion

  //#region private methods
  private async handleCommandSelected(dialog: MatDialog, option: string): Promise<string> {
    let result = option;
    switch (option) {
      case '🔥 Roll Action': {
        return await this.executeRollActionCommand(dialog) ?? '';
      }
      case '🎲 Roll Dice': {
        return await this.executeRollDiceCommand();
      }
      case '🎱 Roll Table': {
        return await this.executeRollTableCommand() ?? '';
      }
      default: {
        return result;
      }
    }
  }

  private async executeRollActionCommand(dialog: MatDialog): Promise<string | null> {
    const actionFriendlyName = await this.prompt(this.blockService.actions.friendlyNames);
    const action = this.blockService.actions.getByFriendlyName(actionFriendlyName)?.content as Action | null;
    if (action) {
      return this.actionService.run(action.content, dialog);
    } else {
      console.log(`Action '${actionFriendlyName}' not found.`);
      return null;
    }
  }

  private async executeRollDiceCommand(): Promise<string> {
    const formula = await this.promptInput();
    return DiceUtil.rollDiceFormula(formula).toString();
  }

  private async executeRollTableCommand(): Promise<string | null> {
    const tableName = await this.prompt(this.blockService.randomTables.friendlyNames);
    const table = this.blockService.randomTables.getByFriendlyName(tableName)?.content as RandomTable | null;
    if (table) {
      return TablesUtil.rollOnTable(table.content);
    } else {
      console.log(`Random table '${tableName}' not found.`);
      return null;
    }
  }

  private onCommandHandled() {
    this.autoComplete.inputControl.setValue('');
    this.autoComplete.setOptions(this.commands);
    this.autoComplete.autocompleteTrigger.closePanel();
    this.mode = "commands";
  }

  private promptInput(): Promise<string> {
    return this.prompt([]);
  }

  private prompt(options: string[]): Promise<string> {
    this.mode = "prompt";
    this.autoComplete.setOptions(options, true);
    return new Promise(resolve => this.commandSelected.subscribe(result => resolve(result)));
  }
  //#endregion
}
