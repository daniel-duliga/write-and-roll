import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandSelected: EventEmitter<string> = new EventEmitter();
  
  commands: any = {
    ViewCharacterSheet: '🌟 View Character Sheet',
    RollMove: '🎮 Roll Move',
    RollDice: '🎲 Roll Dice',
    RollTable: '🎱 Roll Table',
    RollSheet: '📜 Roll Sheet',
    ViewEntities: '🎭 View Entities',
  };

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  showCommands(): void {
    this.dialog.open(
      AutoCompleteComponent,
      {
        width: '480px',
        data: {
          message: 'Command',
          options: Object.keys(this.commands).map(k => this.commands[k]),
          callback: (command: string) => this.handleCommandSelected(command)
        },
      }
    );
  }
  
  handleCommandSelected(option: string): void {
    this.onCommandSelected.emit(option);
  }
}
