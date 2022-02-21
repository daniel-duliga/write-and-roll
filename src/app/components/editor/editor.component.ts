import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { NoteManagerService } from '../note-manager/note-manager.service';
import { CodeMirrorManager } from 'src/app/modules/code-mirror/code-mirror-manager';
import { BlockService } from 'src/app/modules/blocks/block.service';
import { Context } from 'src/app/modules/actions/context';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  // input, output, view children
  @Input() notePath: string = ''; // only used for loading the initial note
  @Output() onFocus: EventEmitter<number> = new EventEmitter();
  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;

  // properties
  public get isDirty(): boolean {
    return this.note.content !== this.initialContent;
  }
  public get formattedName(): string {
    const nameSegments = this.note.path.split('/');
    return nameSegments[nameSegments.length - 1];
  }

  // public members
  public note: Note = new Note();
  public context: Context = new Context('');

  // private members
  private initialContent: string = '';
  private cmManager!: CodeMirrorManager;

  // constructor
  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private noteService: NoteService,
    private noteManagerService: NoteManagerService,
    private blockService: BlockService,
  ) {
    (window as any).openLink = (notePath: string) => this.openLink(notePath);
  }

  // lifecycle events
  ngOnInit(): void {
    let note = this.noteService.get(this.notePath);
    if (!note) {
      note = new Note(this.notePath, '');
      this.noteService.create(note);
    }

    this.note = note;
    this.initialContent = note.content;
    this.note.path = this.notePath;
    this.context = new Context(this.note.content);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.ngxCodeMirror.codeMirror) {
        this.cmManager = new CodeMirrorManager(this.ngxCodeMirror.codeMirror);
        this.configureCodeMirror(this.cmManager.cm);
        this.processInitialContent(this.cmManager.cm);
        this.refresh();
      }
    }, 250);
  }

  // host listener events
  @HostListener('keydown.control.s', ['$event'])
  keydown_ControlS(e: Event) {
    this.save(e);
  }
  @HostListener('window:beforeunload', ['$event'])
  window_BeforeUnload(e: Event): boolean | undefined {
    return !this.isDirty;
  }

  // events
  focusChanged($event: any) {
    if ($event && this.cmManager.cm) {
      this.onFocus.emit(this.cmManager.cm.getScrollInfo().top);
    }
  }
  save($event: Event | null = null) {
    if ($event) { $event.preventDefault(); } // If triggered by key combination, prevent default browser action

    // Save
    const existingItem = this.noteService.get(this.formattedName);
    if (!existingItem) {
      this.noteService.create(this.note);
    } else {
      this.noteService.update(this.note);
      this.blockService.processNoteContent(this.note);
      this.context = new Context(this.note.content);
    }

    // Reflect saved data
    this.initialContent = this.note.content;
  }
  openLink(address: string) {
    this.noteManagerService.requestOpenLink.next(address);
  }

  // public methods
  public replaceSelection(value: string) {
    if (this.cmManager.cm) {
      if (value) { value = `\`${value}\``; }
      const pos = this.cmManager.cm.getCursor();
      this.cmManager.cm.replaceRange(value, pos, pos);
    }
  }
  public refresh() {
    setTimeout(() => {
      if (this.cmManager.cm) {
        this.cmManager.cm.refresh();
      }
    }, 250);
  }
  public setName(name: string) {
    this.note.path = name;
  }

  // private methods
  private configureCodeMirror(cm: CodeMirror.Editor) {
    cm.on('changes', (cm, changes) => this.processContentChanges(cm, changes));
    cm.setOption("extraKeys", {
      Enter: (cm) => cm.execCommand("newlineAndIndentContinueMarkdownList"),
      Tab: (cm) => cm.foldCode(cm.getCursor()),
      "Shift-Tab": (cm) => this.cmManager.toggleFoldAllLines(),
    });
    cm.focus();
  }
  private processInitialContent(cm: CodeMirror.Editor) {
    const lineCount = cm.lineCount();
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      const line = cm.getLine(lineIndex);
      if (line) {
        this.processLineContent(line, lineIndex, null);
      }
    }
  }
  private processContentChanges(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[] | null) {
    if (!changes) { return; }
    const lineIndex = changes[0].to.line;
    const line = cm.getLine(lineIndex);
    if (line) {
      const currentScrollY = cm.getScrollInfo().top;
      this.processLineContent(line, lineIndex, changes);
      cm.scrollTo(null, currentScrollY);
    }
  }
  private processLineContent(line: string, lineIndex: number, changes: CodeMirror.EditorChange[] | null) {
    const allLinks = this.noteService.getAll().map(x => x.path);
    const allAttributes = this.context.attributes.map(x => x.key);
    this.cmManager.processLine(line, lineIndex, changes, this.renderer, allLinks, allAttributes);
  }
}
