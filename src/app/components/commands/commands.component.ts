import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceUtil } from 'src/app/trpg/dice/dice.util';
import { PromptService } from '../prompts/prompt.service';
import { RandomTableStorageService } from 'src/app/storage/random-table/random-table-storage.service';
import { TablesUtil } from 'src/app/trpg/tables.util';
import { Observable, Subject, Subscription } from 'rxjs';
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
    this.subscriptions.push(this.customToggle.subscribe(toggle => {
      if (toggle) {
        this.showCommands();
      }
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  showCommands() {
    this.promptsService
      .openAutoCompletePrompt(this.dialog, "Command", this.commands, this.handleCommandSelected.bind(this));
  }

  handleCommandSelected(option: string) {
    let result = option;
    switch (option) {
      case '🔥 Roll Action': {
        this.executeRollActionCommand();
        break;
      }
      case '🎲 Roll Dice': {
        this.executeRollDiceCommand();
        break;
      }
      case '🎱 Roll Table': {
        this.executeRollTableCommand();
        break;
      }
      default: {
        this.onCommandSelected.emit(result);
      }
    }
  }

  executeRollActionCommand() {
    const actions = this.actionStorageService.getAllPaths();
    this.promptsService.openAutoCompletePrompt(this.dialog, "Action", actions, (actionName: string) => {
      const action = this.actionStorageService.get(actionName);
      if (action) {
        const actionResult = this.actionService.run(action.rawContent);
        this.onCommandSelected.emit(actionResult);
      }
    });
  }

  executeRollDiceCommand() {
    this.promptsService.openInputPrompt(this.dialog, "Formula", (formula: string) => {
      const result = DiceUtil.rollDiceFormula(formula).toMarkdown();
      this.onCommandSelected.emit(result);
    });
  }

  executeRollTableCommand() {
    const tables = this.randomTableStorageService.getAllPaths();
    this.promptsService.openAutoCompletePrompt(this.dialog, "Table", tables, (tableName: string) => {
      const table = this.randomTableStorageService.get(tableName);
      const result = TablesUtil.rollOnTable(table.jsonContent);
      this.onCommandSelected.emit(`**${result}**`);
    });
  }
}
