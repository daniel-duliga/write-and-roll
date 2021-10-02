import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dice } from 'src/app/trpg/dice';
import { AutoCompleteComponent } from '../prompts/auto-complete/auto-complete.component';
import { InputComponent } from '../prompts/input/input.component';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandSelected: EventEmitter<string> = new EventEmitter();

  commands = [
    '🌟 View Character Sheet',
    '🎮 Roll Move',
    '🎲 Roll Dice',
    '🎱 Roll Table',
    '📜 Roll Sheet',
    '🎭 View Entities',
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  showCommands(): void {
    this.dialog.open(
      AutoCompleteComponent,
      {
        width: '480px',
        data: {
          message: 'Command',
          options: this.commands,
          callback: (command: string) => this.handleCommandSelected(command)
        },
      }
    );
  }

  handleCommandSelected(option: string): void {
    let result = option;
    switch (option) {
      case '🎲 Roll Dice': {
        this.dialog.open(
          InputComponent,
          {
            width: '480px',
            data: {
              message: 'Formula',
              callback: (input: string) => {
                result = JSON.stringify(Dice.rollDiceFormula(input));
                this.onCommandSelected.emit(result);
              }
            },
          }
        )
        break;
      }
      default:
        this.onCommandSelected.emit(result);
    }
  }
}
