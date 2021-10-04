import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dice } from 'src/app/trpg/dice';
import { AutoCompleteComponent } from '../prompts/auto-complete/auto-complete.component';
import { InputComponent } from '../prompts/input/input.component';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandSelected: EventEmitter<string> = new EventEmitter();

  commands = [
    // '🌟 View Character Sheet',
    // '🎮 Roll Move',
    '🎲 Roll Dice',
    // '🎱 Roll Table',
    // '📜 Roll Sheet',
    // '🎭 View Entities',
  ];

  constructor(private dialog: MatDialog, private promptsService: PromptService) { }

  ngOnInit(): void { }

  showCommands(): void {
    this.promptsService
      .openAutoCompletePrompt(this.dialog, "Command", this.handleCommandSelected.bind(this), this.commands);
  }

  handleCommandSelected(option: string): void {
    let result = option;
    switch (option) {
      case '🎲 Roll Dice': {
        this.promptsService.openInputPrompt(this.dialog, "Formula", this.executeRollDiceCommand.bind(this));
        break;
      }
      default:
        this.onCommandSelected.emit(result);
    }
  }

  executeRollDiceCommand(input: string): void {
    const result = Dice.rollDiceFormula(input).toMarkdown();
    this.onCommandSelected.emit(result);
  }
}
