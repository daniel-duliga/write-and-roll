import { Component, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditorComponent } from '../editor/editor.component';
import { PromptService } from '../prompts/prompt.service';
import { NoteManagerService } from './note-manager.service';
import { Subscription } from 'rxjs';
import { CommandsComponent } from '../commands/commands.component';
import { BlockService } from 'src/app/modules/blocks/block.service';
import { NoteService } from 'src/app/modules/notes/note.service';
import { EditorService } from 'src/app/modules/editor/editor.service';
import { Note } from 'src/app/modules/notes/note';

@Component({
  selector: 'app-note-manager',
  templateUrl: './note-manager.component.html',
  styleUrls: ['./note-manager.component.css']
})
export class NoteManagerComponent implements OnInit, OnDestroy {
  @ViewChildren('editorComponent') editorComponents!: QueryList<EditorComponent>;
  @ViewChild('commands') commands!: CommandsComponent;

  newOption = '+ Add New';
  subscriptions: Subscription[] = [];
  showAttributes = false;
  focusedEditor: EditorComponent | null = null;

  constructor(
    public editorService: EditorService,
    private zone: NgZone,
    private dialog: MatDialog,
    private noteService: NoteService,
    private promptService: PromptService,
    private noteManagerService: NoteManagerService,
    private blockService: BlockService,
  ) {
    this.subscriptions.push(this.noteManagerService.requestOpen.subscribe(notePath => this.openNote(notePath)));
    this.subscriptions.push(this.noteManagerService.requestClose.subscribe(_ => this.closeFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestRename.subscribe(_ => this.renameFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestFavorite.subscribe(_ => this.favoriteFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestDelete.subscribe(_ => this.deleteFocusedNote()));
    this.subscriptions.push(this.noteManagerService.requestOpenLink.subscribe(notePath => this.openLink(notePath)));
  }

  // lifecycle events
  ngOnInit(): void {
    for (const editor of this.editorService.getOpenEditors()) {
      this.openEditor(editor, false);
    }
    this.focusEditor(this.editorService.getFocusedEditor());
  }
  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // host listener methods
  @HostListener('window:keydown.control.space', ['$event'])
  showCommands() {
    this.commands.showCommands(this.focusedEditor?.context ?? null);
  }

  // commands
  handleCommandResult(result: string) {
    if (this.focusedEditor) {
      this.focusedEditor.replaceSelection(result);
    }
  }
  async openNote(notePath: string) {
    if (this.editorService.openEditorExists(notePath)) {
      this.focusEditor(notePath);
    } else {
      const allNotes = this.noteService.getAll().sort((a, b) => a.compareTo(b));
      if (!allNotes.find(x => x.path === notePath)) {
        this.noteService.create(new Note(notePath, ''));
      }
      this.openEditor(notePath);
    }
  }
  closeFocusedNote() {
    if (!this.focusedEditor) { return; }
    this.closeEditor(this.focusedEditor.notePath);
  }
  async renameFocusedNote() {
    if (!this.focusedEditor || !this.editorService.openEditorExists(this.focusedEditor.notePath)) {
      return;
    }
    const oldName = this.focusedEditor.notePath;
    const newName = await this.promptService.input(this.dialog, 'New Name', oldName);
    if (newName) {
      this.noteService.rename(oldName, newName);
      this.focusedEditor.setName(newName);
      this.focusedEditor.notePath = newName;
      this.editorService.updateOpenedEditor(oldName, newName);
    }
  }
  favoriteFocusedNote() {
    if (!this.focusedEditor) { return; }
    this.focusedEditor.note.favorite = !this.focusedEditor.note.favorite;
    this.focusedEditor.save();
  }
  deleteFocusedNote() {
    if (!this.focusedEditor || !confirm(`Are you sure you want to delete ${this.focusedEditor.notePath}?`)) {
      return;
    }
    this.noteService.delete(this.focusedEditor.notePath);
    this.blockService.removeNoteBlocks(this.focusedEditor.notePath);
    this.closeFocusedNote();
  }
  openLink(address: string) {
    this.zone.run(() => this.openEditor(address));
  }

  // editor management
  private openEditor(notePath: string, focus = true) {
    this.editorService.addOpenedEditor(notePath);
    if (focus) { this.focusEditor(notePath); }
  }
  closeEditor(notePath: string) {
    if (!this.editorService.openEditorExists(notePath)) { return; }

    let editorComponent = this.editorComponents.find(x => x.notePath === notePath);
    if (!editorComponent || (editorComponent.isDirty && !confirm("Are you sure? Changes you made will not be saved."))) {
      return;
    }

    this.editorService.removeOpenedEditor(notePath);
    this.refreshEditors();
  }
  focusEditor(notePath: string) {
    this.editorService.setFocusedEditor(notePath);
    this.refreshEditors();
  }
  setFocusedEditor(editor: EditorComponent) {
    this.focusedEditor = editor;
  }
  private refreshEditors() {
    if (!this.editorComponents) {
      return;
    }

    for (const editor of this.editorComponents) {
      editor.refresh();
    }
  }
}
