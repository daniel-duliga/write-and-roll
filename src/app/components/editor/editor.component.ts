import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { CodeMirrorManager } from 'src/app/modules/code-mirror/code-mirror-manager';
import { Context } from 'src/app/modules/actions/context';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  // input, output, view children
  @Input() noteId: string = '';
  @Input() editorId: string = '';
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() onFocus: EventEmitter<number> = new EventEmitter();
  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;

  // properties
  public get isDirty(): boolean {
    return this.note.content !== this.initialContent;
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
    private db: DbService,
  ) {
    (window as any).openLink = (notePath: string) => this.openLink(notePath);
  }

  // lifecycle events
  async ngOnInit() {
    this.note = await this.db.notes.get(this.noteId);
    this.initialContent = this.note.content;
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
  ngOnChanges(_: SimpleChanges) {
    this.initialContent = this.note.content;
  }

  // host listener events
  @HostListener('keydown.control.s', ['$event'])
  keydown_ControlS(e: Event) {
    if (e) { e.preventDefault(); } // If triggered by key combination, prevent default browser action
    this.save();
  }
  @HostListener('window:beforeunload', ['$event'])
  window_BeforeUnload(e: Event): boolean | undefined {
    return !this.isDirty;
  }

  // events
  save() {
    this.db.notes.update(this.note);
    this.initialContent = this.note.content;
  }
  focusChanged($event: any) {
    if ($event && this.cmManager.cm) {
      this.onFocus.emit(this.cmManager.cm.getScrollInfo().top);
    }
  }
  openLink(address: string) {
    // this.noteManagerService.requestOpenLink.next(address);
  }

  // public methods
  public replaceSelection(value: string) {
    if (this.cmManager.cm) {
      // if (value) { value = `\`${value}\``; }
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
  public focus() {
    this.cmManager.cm.focus();
  }

  // private methods
  private configureCodeMirror(cm: CodeMirror.Editor) {
    cm.on('changes', (cm, changes) => this.processContentChanges(cm, changes));
    cm.setOption("extraKeys", {
      Enter: (cm) => cm.execCommand("newlineAndIndentContinueMarkdownList"),
      "Ctrl-Q": (cm) => cm.foldCode(cm.getCursor()),
      "Ctrl-Shift-Q": (cm) => this.cmManager.toggleFoldAllLines(),
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
  private async processLineContent(line: string, lineIndex: number, changes: CodeMirror.EditorChange[] | null) {
    const allLinks = (await this.db.notes.getAll()).map(x => x.name);
    const allAttributes = this.context.attributes.map(x => x.key);
    this.cmManager.processLine(line, lineIndex, changes, this.renderer, allLinks, allAttributes);
  }
}
