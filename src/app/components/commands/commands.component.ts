import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ActionEntityService } from 'src/app/modules/entities/services/action-entity.service';
import { RandomTableEntityService } from 'src/app/modules/entities/services/random-table-entity.service';
import { ActionsService } from 'src/app/services/actions.service';
import { DiceUtil } from 'src/app/modules/trpg/dice/dice.util';
import { TablesUtil } from 'src/app/modules/trpg/tables.util';
import { AutoCompleteFieldComponent } from '../auto-complete-field/auto-complete-field.component';

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
    private actionEntityService: ActionEntityService,
    private actionService: ActionsService,
    private randomTableEntityService: RandomTableEntityService,
    public dialog: MatDialog,
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
    const actions = this.actionEntityService.getAllPaths();
    const actionName = await this.prompt(actions);
    const action = this.actionEntityService.get(actionName);
    if (action) {
      return this.actionService.run(action.content, dialog);
    } else {
      console.log(`Action '${actionName}' not found.`);
      return null;
    }
  }

  private async executeRollDiceCommand(): Promise<string> {
    const formula = await this.promptInput();
    return DiceUtil.rollDiceFormula(formula).toString();
  }

  private async executeRollTableCommand(): Promise<string | null> {
    const tables = this.randomTableEntityService.getAllNonEmptyPaths();
    const tableName = await this.prompt(tables);
    const table = this.randomTableEntityService.get(tableName);
    if (table) {
      return TablesUtil.rollOnTable(table.parsedContent);
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
