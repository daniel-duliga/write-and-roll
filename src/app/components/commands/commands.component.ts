import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ActionsService } from 'src/app/modules/actions/actions.service';
import { DiceUtil } from 'src/app/modules/trpg/dice/dice.util';
import { TablesUtil } from 'src/app/modules/trpg/tables.util';
import { AutoCompleteFieldComponent } from '../auto-complete-field/auto-complete-field.component';
import { BlockService } from 'src/app/modules/blocks/block.service';
import { Action } from 'src/app/modules/blocks/action';
import { RandomTable } from 'src/app/modules/blocks/random-table';
import { PromptService } from '../prompts/prompt.service';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { NoteManagerService } from '../note-manager/note-manager.service';
import { CommandService } from './command.service';
import { Context } from 'src/app/modules/actions/context';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  @Output() onCommandResult: EventEmitter<string> = new EventEmitter();
  @ViewChild('autoComplete') autoComplete!: AutoCompleteFieldComponent;
  commands = {
    noteOpen: 'note/open',
    noteClose: 'note/close',
    noteRename: 'note/rename',
    noteFavorite: 'note/favorite',
    noteDelete: 'note/delete',
    rollTable: 'roll/table',
    rollAction: 'roll/action',
    rollDice: 'roll/dice',
  };

  constructor(
    public dialog: MatDialog,
    private actionService: ActionsService,
    private blockService: BlockService,
    private promptService: PromptService,
    private noteService: NoteService,
    private noteManagerService: NoteManagerService,
    private commandService: CommandService,
  ) { }

  ngOnInit(): void { }

  // public methods
  public async showCommands(context: Context): Promise<void> {
    this.commandService.executionInProgress = true;

    const command = await this.promptService.autocomplete(
      this.dialog,
      "Command",
      [
        this.commands.noteOpen,
        this.commands.noteClose,
        this.commands.noteRename,
        this.commands.noteFavorite,
        this.commands.noteDelete,
        this.commands.rollDice,
        this.commands.rollTable,
        this.commands.rollAction
      ]);
    await this.executeCommand(command, context, this.dialog);

    this.commandService.executionInProgress = false;
  }

  // commands execution
  private async executeCommand(option: string, context: Context, dialog: MatDialog): Promise<void> {
    switch (option) {
      // Note
      case this.commands.noteOpen: {
        await this.executeOpenNoteCommand();
        break;
      }
      case this.commands.noteClose: {
        this.noteManagerService.requestClose.next();
        break;
      }
      case this.commands.noteRename: {
        this.noteManagerService.requestRename.next();
        break;
      }
      case this.commands.noteFavorite: {
        this.noteManagerService.requestFavorite.next();
        break;
      }
      case this.commands.noteDelete: {
        this.noteManagerService.requestDelete.next();
        break;
      }

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
        break;
      }
    }
  }
  private async executeOpenNoteCommand(): Promise<void> {
    const allNotes = this.noteService.getAll().sort((a, b) => a.compareTo(b));
    const allNoteNames = allNotes.map(x => x.favorite ? `${x.path} *` : x.path);
    let noteName = await this.promptService.autocomplete(this.dialog, "Note", allNoteNames);
    if (noteName) {
      if (noteName.endsWith(' *')) {
        noteName = noteName.slice(0, noteName.length - 2);
      }
      this.noteManagerService.requestOpen.next(noteName);
    }
  }
  private async executeRollActionCommand(context: Context, dialog: MatDialog): Promise<void> {
    const actionFriendlyName = await this.promptAutoComplete(this.blockService.actions.friendlyNames);
    const action = this.blockService.actions.getByFriendlyName(actionFriendlyName);
    if(!action) {
      this.onCommandResult.emit('');
      return;
    }
    const result = await this.actionService.run(action.name, context, dialog);
    this.onCommandResult.emit(result);
  }
  private async executeRollDiceCommand(): Promise<void> {
    const formula = await this.promptInput();
    const result = DiceUtil.rollDiceFormula(formula).toString();
    this.onCommandResult.emit(result);
  }
  private async executeRollTableCommand(): Promise<void> {
    const tableName = await this.promptAutoComplete(this.blockService.randomTables.friendlyNames);
    const table = this.blockService.randomTables.getByFriendlyName(tableName)?.content as RandomTable | null;
    if (table) {
      const result = TablesUtil.rollOnTable(table.content);
      this.onCommandResult.emit(result);
    } else {
      console.log(`Random table '${tableName}' not found.`);
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
