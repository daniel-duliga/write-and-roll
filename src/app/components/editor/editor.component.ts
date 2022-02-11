import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { LineWidget, Pos } from 'codemirror';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { NoteManagerService } from '../note-manager/note-manager.service';
import { marked } from 'marked';
import { CommandService } from '../commands/command.service';
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

  // member variables
  public note: Note = new Note();
  private initialContent: string = '';
  private lineWidgets: LineWidget[] = [];
  private cursorPosition: CodeMirror.Position | null = null;

  // constructor
  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private noteService: NoteService,
    private noteManagerService: NoteManagerService,
    private commandService: CommandService,
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
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.codeMirror) {
        this.configureCodeMirror(this.codeMirror);
        this.processCodeMirrorContent(this.codeMirror, null);
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
    if ($event && this.codeMirror) {
      this.onFocus.emit(this.codeMirror.getScrollInfo().top);
    }
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
  openLink(address: string) {
    this.noteManagerService.requestOpenLink.next(address);
  }

  // public methods
  public replaceSelection(option: string) {
    if (this.codeMirror && this.cursorPosition) {
      this.codeMirror.setCursor(this.cursorPosition.line, this.cursorPosition.ch);
      this.codeMirror.replaceRange(
        `\`${option}\``,
        { line: this.cursorPosition.line, ch: this.cursorPosition.ch },
        { line: this.cursorPosition.line, ch: this.cursorPosition.ch },
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
  public setName(name: string) {
    this.note.path = name;
  }

  // code mirror
  private configureCodeMirror(cm: CodeMirror.Editor) {
    cm.on('changes', (cm, changes) => { this.processCodeMirrorContent(cm, changes); });
    cm.on('focus', (cm, focusEvent) => this.setCodeMirrorCursorPosition(cm));
    cm.on('cursorActivity', (cm) => this.storeCursorPosition(cm));

    cm.setOption("extraKeys", {
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

    cm.focus();
  }
  private processCodeMirrorContent(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[] | null) {
    // Render widgets
    if (changes) {
      // Process only the line that changed
      const lineIndex = changes[0].to.line
      const line = cm.getLine(lineIndex);
      if (line) {
        const currentScrollY = cm.getScrollInfo().top;
        this.clearLineWidgets(lineIndex);
        this.showLinkAutoComplete(cm, changes, line);
        this.renderLineWidgets(cm, line, lineIndex);
        cm.scrollTo(null, currentScrollY);
      }
    } else {
      // Process the entire content
      for (let lineIndex = 0; lineIndex < cm.lineCount(); lineIndex++) {
        const line = cm.getLine(lineIndex)
        if (line) {
          this.clearLineWidgets(lineIndex);
          this.renderLineWidgets(cm, cm.getLine(lineIndex), lineIndex);
        }
      }
    }
    // Render styles
    setTimeout(() => {
      this.renderMarkdownStyles(cm);
    }, changes ? 250 : 0);
  }
  private showLinkAutoComplete(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[], line: string) {
    let changeCharIndex = getChangeCharIndex();
    if (changeCharIndex != -1) {
      let whitespaceCharIndex = getWhitespaceCharIndex();
      const linkBrackets = line.slice(whitespaceCharIndex + 1, whitespaceCharIndex + 3);
      if (linkBrackets === '[[') {
        const filter = line.slice(whitespaceCharIndex + 3, changeCharIndex + 1);
        const cursor = cm.getCursor();
        const start = cursor.ch
        const end = cursor.ch;
        const options = this.noteService.getAll().map(x => x.path).filter(x => x.toLowerCase().startsWith(filter.toLowerCase()));

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

    processLinkAutocomplete();

    function getWhitespaceCharIndex() {
      let whitespaceCharIndex = line.lastIndexOf(' ', changeCharIndex);
      if (whitespaceCharIndex === -1) {
        whitespaceCharIndex = 0;
      };
      return whitespaceCharIndex;
    }

    function getChangeCharIndex() {
      let changeCharIndex = -1;
      if (changes[0].origin === '+input') {
        changeCharIndex = changes[0].to.ch;
      } else if (changes[0].origin === '+delete') {
        changeCharIndex = changes[0].from.ch - 1;
      }
      return changeCharIndex;
    }

    function processLinkAutocomplete() {
      const change = changes[0];
      if (change.origin === 'complete') {
        const line = cm.getLine(change.to.line);
        const bracketsPos = new Pos(change.to.line, line.lastIndexOf('[[', change.to.ch + 1) + 2);
        cm.replaceRange('', bracketsPos, change.to);
      }
    }
  }
  private clearLineWidgets(lineIndex: number) {
    const lineWidgets = this.lineWidgets.splice(lineIndex, 1);
    if (lineWidgets.length === 1) {
      lineWidgets[0].clear();
    }
  }
  private renderLineWidgets(cm: CodeMirror.Editor, line: string, lineIndex: number) {
    this.renderImages(cm, line, lineIndex);
    this.renderLinks(cm, line, lineIndex);
  }
  private renderImages(cm: CodeMirror.Editor, line: string, lineIndex: number) {
    const images = line.matchAll(/!\[\w*\]\(\w+\:\/\/[\w\.\/\-]+\)/g);
    for (const image of images) {
      let imageUrl = image.toString().match(/\(.*\)/g)?.toString();
      if (imageUrl) {
        imageUrl = imageUrl.slice(1, imageUrl.length - 1);

        let image: HTMLElement = this.renderer.createElement('img');
        this.renderer.setAttribute(image, 'src', imageUrl);
        this.renderer.setStyle(image, 'max-height', '1024px');
        this.renderer.setStyle(image, 'max-width', '100%');

        let imageContainer: HTMLElement = this.renderer.createElement('div');
        this.renderer.setStyle(imageContainer, 'text-align', 'center');
        imageContainer.appendChild(image);

        const imageWidget = cm.addLineWidget(lineIndex, imageContainer);
        this.lineWidgets.push(imageWidget);
      }
    }
  }
  private renderLinks(cm: CodeMirror.Editor, line: string, lineIndex: number) {
    const linkMatches = line.matchAll(/\[\[(\w*\s*\d*)+\]\]/g);
    for (const linkMatch of linkMatches) {
      const linkIndexInLine = linkMatch.index ?? 0;
      const link = linkMatch[0].toString();
      const address = link.slice(2, link.length - 2);

      cm.markText(
        { line: lineIndex, ch: linkIndexInLine },
        { line: lineIndex, ch: linkIndexInLine + link.length },
        {
          className: 'markdown-link',
          attributes: {
            'notePath': link,
            'onClick': `openLink('${address}')`
          },
        }
      );
    }
  }
  private renderMarkdownStyles(cm: CodeMirror.Editor) {
    // Parse as markdown
    const mdTokens = marked.lexer(this.note.content);

    // Clean up old styles
    // for (let i = 0; i <= cm.lineCount(); i++) {
    //   cm.removeLineClass(i, 'text', 'markdown-code');
    //   cm.removeLineClass(i, 'text', 'markdown-heading');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-1');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-2');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-3');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-4');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-5');
    //   cm.removeLineClass(i, 'text', 'markdown-heading-6');
    // }

    // Apply new styles
    let currentLineIndex = 0;
    for (const mdToken of mdTokens) {
      const blockLines = mdToken.raw.trim().split('\n')
      const startLineIndex = currentLineIndex;
      const endLineIndex = startLineIndex + blockLines.length - 1;

      switch (mdToken.type) {
        case 'code': {
          // Style block background
          for (let i = startLineIndex; i <= endLineIndex; i++) {
            cm.addLineClass(i, 'text', 'markdown-code');
          }
          // Disable spell-check
          cm.markText(
            { line: startLineIndex, ch: 0 },
            { line: endLineIndex, ch: blockLines[blockLines.length - 1].length },
            { attributes: { 'spellcheck': 'false' } }
          );
          break;
        }
        case 'heading': {
          // for (let i = startLineIndex; i <= endLineIndex; i++) {
          //   cm.addLineClass(i, 'text', `markdown-heading markdown-heading-${mdToken.depth}`);
          // }
          break;
        }
        default:
          break;
      }

      // Compute line index for next iteration
      currentLineIndex += (mdToken.raw.match(/\n/g) || []).length;
    }
  }
  private setCodeMirrorCursorPosition(cm: CodeMirror.Editor) {
    if (this.cursorPosition) {
      cm.setCursor(this.cursorPosition);
    }
  }

  // private methods
  private storeCursorPosition(cm: CodeMirror.Editor) {
    if (!this.commandService.executionInProgress) {
      this.cursorPosition = cm.getCursor();
    }
  }
}
