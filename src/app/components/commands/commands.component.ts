import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceUtil } from 'src/app/trpg/dice/dice.util';
import { PromptService } from '../prompts/prompt.service';
import { RandomTableStorageService } from 'src/app/storage/random-table/random-table-storage.service';
import { TablesUtil } from 'src/app/trpg/tables.util';
import { Subject, Subscription } from 'rxjs';
import { ActionStorageService } from 'src/app/storage/action-storage.service';
import { ActionService } from '../actions/action.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit, OnDestroy {
  @Input() customToggle: Subject<boolean> = new Subject();
  @Output() onCommandSelected: EventEmitter<string> = new EventEmitter();

  commands = [
    '🔥 Roll Action',
    '🎱 Roll Table',
    '🎲 Roll Dice',
    // '🌟 View Character Sheet',
    // '📜 Roll Sheet',
    // '🎭 View Entities',
  ];

  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private promptsService: PromptService,
    private randomTableStorageService: RandomTableStorageService,
    private actionStorageService: ActionStorageService,
    private actionService: ActionService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.customToggle.subscribe(async toggle => {
      if (toggle) {
        await this.showCommands();
      }
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async showCommands() {
    const command = await this.promptsService.openAutoCompletePrompt(this.dialog, "Command", this.commands);
    await this.handleCommandSelected(command);
  }

  async handleCommandSelected(option: string) {
    let result = option;
    switch (option) {
      case '🔥 Roll Action': {
        await this.executeRollActionCommand();
        break;
      }
      case '🎲 Roll Dice': {
        await this.executeRollDiceCommand();
        break;
      }
      case '🎱 Roll Table': {
        await this.executeRollTableCommand();
        break;
      }
      default: {
        this.onCommandSelected.emit(result);
      }
    }
  }

  async executeRollActionCommand() {
    const actions = this.actionStorageService.getAllPaths();
    const actionName = await this.promptsService.openAutoCompletePrompt(this.dialog, "Action", actions);
    const action = this.actionStorageService.get(actionName);
    if (action) {
      const actionResult = await this.actionService.run(action.rawContent, this.dialog);
      this.onCommandSelected.emit(actionResult);
    }
  }

  async executeRollDiceCommand() {
    const formula = await this.promptsService.openInputPrompt(this.dialog, "Formula");
    const result = DiceUtil.rollDiceFormula(formula).toString();
    this.onCommandSelected.emit(result);
  }

  async executeRollTableCommand() {
    const tables = this.randomTableStorageService.getAllPaths();
    const tableName = await this.promptsService.openAutoCompletePrompt(this.dialog, "Table", tables);
    const table = this.randomTableStorageService.get(tableName);
    let rollResult = '';
    if (table) {
      rollResult = TablesUtil.rollOnTable(table.content);
    }
    this.onCommandSelected.emit(rollResult);
  }
}
