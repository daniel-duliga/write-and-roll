import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { LineWidget, Pos } from 'codemirror';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { CommandsComponent } from '../commands/commands.component';
import { NoteManagerService } from '../note-manager/note-manager.service';

export type MoveDirection = "left" | "right";
export type EditorMode = "markdown" | "javascript" | "default";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() name: string = ''; // only used for loading the initial note
  @Input() mode: EditorMode = "default";
  @Input() minimized = false;

  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() onMove: EventEmitter<MoveDirection> = new EventEmitter();
  @Output() onMinimize: EventEmitter<boolean> = new EventEmitter();
  @Output() onRename: EventEmitter<void> = new EventEmitter();
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  @Output() onOpenNote: EventEmitter<void> = new EventEmitter();

  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;
  @ViewChild('commands') commands!: CommandsComponent;

  note: Note = new Note();
  initialContent: string = '';
  lineWidgets: LineWidget[] = [];

  //#region properties
  public get codeMirror(): CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }
  public get isDirty(): boolean {
    return this.note.content !== this.initialContent;
  }
  public get formattedName(): string {
    const nameSegments = this.note.path.split('/');
    return nameSegments[nameSegments.length - 1];
  }
  //#endregion

  constructor(
    private renderer: Renderer2,
    private noteService: NoteService,
    public dialog: MatDialog,
    private noteManagerService: NoteManagerService
  ) {
    (window as any).openLink = (notePath: string) => this.linkClicked(notePath);
  }

  ngOnInit(): void {
    this.getAndSetNote(this.name);
  }

  private getAndSetNote(name: string) {
    let note = this.noteService.get(name);
    if (!note) {
      note = new Note(name, '');
      this.noteService.create(note);
    }

    this.note = note;
    this.initialContent = note.content;
    this.note.path = name;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.configureCodeMirror();
      this.postProcessCodeMirror(null);
      this.refresh();
    }, 250);
  }

  private configureCodeMirror() {
    if (!this.codeMirror) { return; }

    this.codeMirror.setOption("extraKeys", {
      Enter: function (cm) {
        cm.execCommand("newlineAndIndentContinueMarkdownList");
      },
      Tab: function (cm) {
        cm.foldCode(cm.getCursor());
      },
      "Shift-Tab": function (cm) {
        const linesCount = cm.lineCount();

        let currentMode: "fold" | "unfold" = "fold";
        for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
          if (cm.isFolded(new Pos(lineIndex))) {
            currentMode = "unfold";
            break;
          }
        }

        for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
          cm.foldCode(lineIndex, undefined, currentMode);
        }
      }
    });

    this.codeMirror.on('changes', (cm, changes) => this.postProcessCodeMirror(changes));

    this.codeMirror.focus();
  }

  private postProcessCodeMirror(changes: CodeMirror.EditorChange[] | null) {
    if (!this.codeMirror) { return; }

    const currentScrollY = this.codeMirror.getScrollInfo().top;

    if (changes) {
      this.showLinkAutoComplete(changes);
      processLinkAutocomplete(this.codeMirror, changes);
    }
    this.clearLineWidgets();
    this.renderWidgets();

    this.codeMirror.scrollTo(null, currentScrollY);

    function processLinkAutocomplete(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[]) {
      const change = changes[0];
      if (change.origin === 'complete') {
        const line = cm.getLine(change.to.line);
        const bracketsPos = new Pos(change.to.line, line.lastIndexOf('[[', change.to.ch + 1) + 2);
        cm.replaceRange('', bracketsPos, change.to);
      }
    }
  }

  private showLinkAutoComplete(changes: CodeMirror.EditorChange[]) {
    if (!this.codeMirror) { return; }

    const change = changes[0];
    const line = this.codeMirror.getLine(change.to.line);

    if (!line) { return; }

    let changeCharIndex = -1;
    const changesOrigin = changes[0].origin;
    if (changesOrigin === '+input') {
      changeCharIndex = change.to.ch;
    } else if (changesOrigin === '+delete') {
      changeCharIndex = change.from.ch - 1;
    }

    if (changeCharIndex != -1) {
      let whitespaceCharIndex = line.lastIndexOf(' ', changeCharIndex);
      if (whitespaceCharIndex === -1) { whitespaceCharIndex = 0 };

      const linkBrackets = line.slice(whitespaceCharIndex + 1, whitespaceCharIndex + 3);
      if (linkBrackets === '[[') {
        const filter = line.slice(whitespaceCharIndex + 3, changeCharIndex + 1);
        showNotesAutocomplete(this.codeMirror, this.noteService, filter);
      }
    }

    function showNotesAutocomplete(cm: CodeMirror.Editor, noteService: NoteService, filter: string) {
      if (!cm) { return; }

      const cursor = cm.getCursor();
      const start = cursor.ch
      const end = cursor.ch;
      const options = noteService.getAll().map(x => x.path).filter(x => x.toLowerCase().startsWith(filter.toLowerCase()));

      cm.showHint({
        hint: () => {
          return {
            list: options,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
          };
        },
        completeSingle: false,
        moveOnOverlap: true
      });
    }
  }

  private renderWidgets() {
    if (!this.codeMirror) { return; }

    for (let lineIndex = 0; lineIndex < this.codeMirror.lineCount(); lineIndex++) {
      const line = this.codeMirror.getLine(lineIndex);
      this.renderImages(line, lineIndex);
      this.renderLinks(line, lineIndex);
    }
  }

  private renderImages(line: string, lineIndex: number) {
    if (!this.codeMirror) { return; }

    const images = line.matchAll(/!\[\w*\]\(\w+\:\/\/[\w\.\/\-]+\)/g);
    for (const image of images) {
      let imageUrl = image.toString().match(/\(.*\)/g)?.toString();
      if (imageUrl) {
        imageUrl = imageUrl.slice(1, imageUrl.length - 1);

        let image: HTMLElement = this.renderer.createElement('img');
        this.renderer.setAttribute(image, 'src', imageUrl);
        this.renderer.setStyle(image, 'max-height', '480px');
        this.renderer.setStyle(image, 'max-width', '100%');

        let imageContainer: HTMLElement = this.renderer.createElement('div');
        this.renderer.setStyle(imageContainer, 'text-align', 'center');
        imageContainer.appendChild(image);

        const imageWidget = this.codeMirror.addLineWidget(lineIndex, imageContainer);
        this.lineWidgets.push(imageWidget);
      }
    }
  }

  private renderLinks(line: string, lineIndex: number) {
    if (!this.codeMirror) { return; }

    const linkMatches = line.matchAll(/\[\[(\w*\s*\d*)+\]\]/g);
    for (const linkMatch of linkMatches) {
      const linkIndexInLine = linkMatch.index ?? 0;
      const link = linkMatch[0].toString();
      const address = link.slice(2, link.length - 2);

      this.codeMirror.getDoc().markText(
        { line: lineIndex, ch: linkIndexInLine },
        { line: lineIndex, ch: linkIndexInLine + link.length },
        {
          className: 'markdown-link',
          attributes: {
            'notePath': link,
            'onClick': `openLink('${address}')`
          }
        }
      );
    }
  }

  public refresh() {
    setTimeout(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
      }
    }, 250);
  }

  @HostListener('keydown.control.space', ['$event'])
  async onShowCommands(e: Event) {
    this.commands.focus();
  }

  @HostListener('keydown.control.s', ['$event'])
  onSave(e: Event) {
    this.save(e);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: Event): boolean | undefined {
    return !this.isDirty;
  }

  close() {
    if (this.validateUnsavedChanges()) {
      this.onClose.emit();
    }
  }

  move(direction: MoveDirection) {
    this.onMove.emit(direction);
  }

  save($event: Event | null = null) {
    // If triggered by key combination, prevent default browser save action
    if ($event) {
      $event.preventDefault();
    }

    // Save
    const existingItem = this.noteService.get(this.formattedName);
    if (!existingItem) {
      this.noteService.create(this.note);
    } else {
      this.noteService.update(this.note);
    }

    // Reflect saved data
    this.initialContent = this.note.content;
  }

  toggleMinimize(minimized: boolean) {
    this.minimized = minimized;
    this.onMinimize.emit(minimized);
  }

  linkClicked(address: string) {
    this.noteManagerService.openNotes.next(address);
  }

  handleCommand(option: string) {
    if (option && this.codeMirror) {
      this.codeMirror.replaceSelection(`\`${option}\``);
      this.codeMirror.focus();
    }
  }

  setName(name: string) {
    this.note.path = name;
  }

  private clearLineWidgets() {
    for (const lineWidget of this.lineWidgets) {
      lineWidget.clear();
    }
    this.lineWidgets = [];
  }

  private validateUnsavedChanges() {
    return !this.isDirty || confirm("Are you sure? Changes you made will not be saved.");
  }
}
