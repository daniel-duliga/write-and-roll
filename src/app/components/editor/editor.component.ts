import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { LineWidget, Pos } from 'codemirror';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { NoteManagerService } from '../note-manager/note-manager.service';

export type MoveDirection = "left" | "right";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  // input, output, view children
  @Input() name: string = ''; // only used for loading the initial note
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Output() onRename: EventEmitter<void> = new EventEmitter();
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  @Output() onFocus: EventEmitter<void> = new EventEmitter();
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

  // private variables
  note: Note = new Note();
  initialContent: string = '';
  lineWidgets: LineWidget[] = [];
  
  // constructor
  constructor(
    private renderer: Renderer2,
    private noteService: NoteService,
    public dialog: MatDialog,
    private noteManagerService: NoteManagerService
  ) {
    (window as any).openLink = (notePath: string) => this.openLink(notePath);
  }

  // lifecycle events
  ngOnInit(): void {
    let note = this.noteService.get(this.name);
    if (!note) {
      note = new Note(this.name, '');
      this.noteService.create(note);
    }

    this.note = note;
    this.initialContent = note.content;
    this.note.path = this.name;
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

    if (changes) {
      this.showLinkAutoComplete(this.codeMirror, changes);
      this.processLinkAutocomplete(this.codeMirror, changes);
    }
    
    const currentScrollY = this.codeMirror.getScrollInfo().top;
    
    this.clearWidgets();
    this.renderWidgets();
    
    this.codeMirror.scrollTo(null, currentScrollY);
  }
  private showLinkAutoComplete(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[]) {
    const line = cm.getLine(changes[0].to.line);

    if (!line) { return; }

    let changeCharIndex = -1;
    if (changes[0].origin === '+input') {
      changeCharIndex = changes[0].to.ch;
    } else if (changes[0].origin === '+delete') {
      changeCharIndex = changes[0].from.ch - 1;
    }

    if (changeCharIndex != -1) {
      let whitespaceCharIndex = line.lastIndexOf(' ', changeCharIndex);
      if (whitespaceCharIndex === -1) { 
        whitespaceCharIndex = 0 
      };

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
  }
  private processLinkAutocomplete(cm: CodeMirror.Editor, changes: CodeMirror.EditorChange[]) {
    const change = changes[0];
    if (change.origin === 'complete') {
      const line = cm.getLine(change.to.line);
      const bracketsPos = new Pos(change.to.line, line.lastIndexOf('[[', change.to.ch + 1) + 2);
      cm.replaceRange('', bracketsPos, change.to);
    }
  }
  private clearWidgets() {
    for (const lineWidget of this.lineWidgets) {
      lineWidget.clear();
    }
    this.lineWidgets = [];
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
        this.renderer.setStyle(imageContainer, 'text-align', 'left');
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
    if($event) {
      this.onFocus.emit();
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
  toggleFavorite() {
    this.note.favorite = !this.note.favorite;
    this.save();
  }
  close() {
    if (!this.isDirty || confirm("Are you sure? Changes you made will not be saved.")) {
      this.onClose.emit();
    }
  }
  openLink(address: string) {
    this.noteManagerService.openNoteLinkRequests.next(address);
  }
  
  // public methods
  public replaceSelection(option: string) {
    if (this.codeMirror) {
      this.codeMirror.replaceSelection(`\`${option}\``);
      this.codeMirror.focus();
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
}
