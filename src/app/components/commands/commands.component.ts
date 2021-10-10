import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceUtil } from 'src/app/trpg/dice/dice.util';
import { PromptService } from '../prompts/prompt.service';
import { RandomTableService } from 'src/app/storage/random-table/random-table.service';
import { TablesUtil } from 'src/app/trpg/tables.util';
import { Observable, Subject, Subscription } from 'rxjs';

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
    private randomTableService: RandomTableService
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
      .openAutoCompletePrompt(this.dialog, "Command", this.handleCommandSelected.bind(this), this.commands);
  }

  handleCommandSelected(option: string) {
    let result = option;
    switch (option) {
      case '🎲 Roll Dice': {
        this.promptsService.openInputPrompt(this.dialog, "Formula", this.executeRollDiceCommand.bind(this));
        break;
      }
      case '🎱 Roll Table': {
        const tables = this.randomTableService.getAllPaths();
        this.promptsService.openAutoCompletePrompt(this.dialog, "Table", this.executeRollTableCommand.bind(this), tables);
        break;
      }
      default: {
        this.onCommandSelected.emit(result);
      }
    }
  }

  executeRollDiceCommand(input: string) {
    const result = DiceUtil.rollDiceFormula(input).toMarkdown();
    this.onCommandSelected.emit(result);
  }

  executeRollTableCommand(input: string) {
    const table = this.randomTableService.get(input);
    const result = TablesUtil.rollOnTable(table.jsonContent);
    this.onCommandSelected.emit(`**${result}**`);
  }
}
