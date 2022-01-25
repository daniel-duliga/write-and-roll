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
import { PromptService } from '../prompts/prompt.service';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { NoteManagerService } from '../note-manager/note-manager.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandResult: EventEmitter<string> = new EventEmitter();

  @ViewChild('autoComplete') autoComplete!: AutoCompleteFieldComponent;

  commands = {
    openNote: 'Open Note',
    rollTable: 'Roll Table',
    rollAction: 'Roll Action',
    rollDice: 'Roll Dice',
  };

  constructor(
    public dialog: MatDialog,
    private actionService: ActionsService,
    private blockService: BlockService,
    private promptService: PromptService,
    private noteService: NoteService,
    private noteManagerService: NoteManagerService,
  ) { }

  ngOnInit(): void { }
  
  public async showCommands(): Promise<void> {
    const command = await this.promptService.autocomplete(this.dialog, "Command", [
      this.commands.openNote, this.commands.rollDice, this.commands.rollTable, this.commands.rollAction]);
    await this.executeCommand(this.dialog, command);
  }

  //#region commands execution
  private async executeCommand(dialog: MatDialog, option: string): Promise<void> {
    switch (option) {
      case this.commands.openNote: {
        await this.executeOpenNoteCommand();
        break;
      }
      case this.commands.rollAction: {
        await this.executeRollActionCommand(dialog);
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
        break;
      }
    }
  }

  private async executeOpenNoteCommand(): Promise<void> {
    const allNotes = this.noteService.getAll().sort((a,b) => a.compareTo(b));
    const allNoteNames = allNotes.map(x => x.favorite ? `${x.path} *` : x.path);
    let noteName = await this.promptService.autocomplete(this.dialog, "Note", allNoteNames);
    if (noteName) {
      if(noteName.endsWith(' *')) {
        noteName = noteName.slice(0, noteName.length - 2);
      }
      this.noteManagerService.openNoteRequests.next(noteName);
    }
  }

  private async executeRollActionCommand(dialog: MatDialog): Promise<void> {
    const actionFriendlyName = await this.prompt(this.blockService.actions.friendlyNames);
    const action = this.blockService.actions.getByFriendlyName(actionFriendlyName)?.content as Action | null;
    if (action) {
      const result = await this.actionService.run(action.content, dialog);
      this.onCommandResult.emit(result);
    } else {
      console.log(`Action '${actionFriendlyName}' not found.`);
    }
  }

  private async executeRollDiceCommand(): Promise<void> {
    const formula = await this.promptInput();
    const result = DiceUtil.rollDiceFormula(formula).toString();
    this.onCommandResult.emit(result);
  }

  private async executeRollTableCommand(): Promise<void> {
    const tableName = await this.prompt(this.blockService.randomTables.friendlyNames);
    const table = this.blockService.randomTables.getByFriendlyName(tableName)?.content as RandomTable | null;
    if (table) {
      const result = TablesUtil.rollOnTable(table.content);
      this.onCommandResult.emit(result);
    } else {
      console.log(`Random table '${tableName}' not found.`);
    }
  }
  //#endregion

  //#region prompts
  private async promptInput(): Promise<string> {
    return await this.promptService.input(this.dialog, "", "");
  }

  private async prompt(options: string[]): Promise<string> {
    return await this.promptService.autocomplete(this.dialog, "", options);
  }
  //#endregion
}
