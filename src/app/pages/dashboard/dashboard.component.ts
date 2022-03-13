import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';
import { NoteListComponent } from 'src/app/components/note-list/note-list.component';
import { Editor } from 'src/app/database/models/editor';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { RandomTableService } from 'src/app/services/random-table.service';
import { TablesUtil } from 'src/app/modules/trpg/tables.util';
import { ActionsService } from 'src/app/modules/actions/actions.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('noteList') noteList!: NoteListComponent;
  @ViewChildren('editor') editorComponents!: QueryList<EditorComponent>;

  editors: Editor[] = [];
  focusedEditor: Editor | null = null;

  constructor(
    public router: Router,
    private db: DbService,
    private randomTableService: RandomTableService,
    private actionService: ActionsService,
    private dialog: MatDialog,
  ) { }

  // lifecycle
  async ngOnInit() {
    // this.editors = await this.db.editors.getAll();
  }
  ngAfterViewInit() { }

  // events
  async openEditor(noteId: string) {
    let editor = new Editor(noteId);
    // editor = await this.db.editors.create(editor);
    this.editors = [editor];
    this.refreshEditors();
  }
  closeEditor(editorId: string) {
    const editor = this.editors.find(x => x._id === editorId);
    if (editor) {
      this.editors = this.editors.filter(x => x._id !== editor._id);
      this.db.editors.delete(editor);
      this.refreshEditors();
    }
  }
  focusEditor(editor: Editor) {
    this.focusedEditor = editor;
  }
  async roll(note: Note) {
    if (!this.focusedEditor) { return; }

    const editorComponent = this.editorComponents.find(x => x.editorId === this.focusedEditor?._id);
    if (!editorComponent) { return; }

    let rollResult = '';
    switch (note.type) {
      case 'action': {
        rollResult = await this.actionService.run(note._id, editorComponent.context, this.dialog);
        break;
      }
      case 'random-table': {
        const table = await this.randomTableService.get(note._id);
        rollResult = TablesUtil.rollOnTable(table.content);
        break;
      }
      default:
        return;
    }
    
    editorComponent.replaceSelection(rollResult);
    editorComponent.refresh();
  }

  // private methods
  refreshEditors() {
    for (const editorComponent of this.editorComponents) {
      editorComponent.refresh();
    }
  }
}
