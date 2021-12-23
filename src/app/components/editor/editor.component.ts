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

  //#region lifecycle events
  ngOnInit(): void {
    this.getAndSetNote(this.name);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.configureCodeMirror();
      this.postProcessCodeMirror();
      this.refresh();
    }, 250);
  }
  //#endregion

  //#region host listener methods
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
  //#endregion

  //#region event handlers
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
  //#endregion

  //#region public methods
  refresh() {
    setTimeout(() => {
      if (this.codeMirror) {
        this.codeMirror.refresh();
      }
    }, 250);
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
  //#endregion

  //#region postprocessing
  private postProcessCodeMirror() {
    if (this.mode !== 'markdown') { return; }

    if (this.codeMirror) {
      const currentScrollY = this.codeMirror.getScrollInfo().top;
      this.clearLineWidgets();
      this.clearTextMarkers();
      this.processCodemirrorLines();
      this.codeMirror.scrollTo(null, currentScrollY);
    }
  }

  private clearLineWidgets() {
    for (const lineWidget of this.lineWidgets) {
      lineWidget.clear();
    }
    this.lineWidgets = [];
  }

  private clearTextMarkers() {
    if (!this.codeMirror) { return; }

    // save fold state
    let foldedLinesIndexes: number[] = [];
    for (let lineIndex = 0; lineIndex < this.codeMirror.lineCount(); lineIndex++) {
      if (this.codeMirror.isFolded(new Pos(lineIndex))) {
        foldedLinesIndexes.push(lineIndex);
      }
    }

    // clear markers
    var textMarkers = this.codeMirror.getAllMarks();
    for (const textMarker of textMarkers) {
      textMarker.clear();
    }

    // set fold state
    for (const lineIndex of foldedLinesIndexes) {
      this.codeMirror.foldCode(lineIndex, undefined, 'fold');
    }
  }

  private processCodemirrorLines() {
    if (!this.codeMirror) { return; }

    for (let lineIndex = 0; lineIndex < this.codeMirror.lineCount(); lineIndex++) {
      const line = this.codeMirror.getLine(lineIndex);
      this.renderImages(line, lineIndex);
      this.renderInternalLinks(line, lineIndex);
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

  private renderInternalLinks(line: string, lineIndex: number) {
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
  //#endregion

  //#region private methods
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

  private configureCodeMirror() {
    if (this.codeMirror) {
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
        },
        "Ctrl-E": this.getNotesAutocomplete.bind(this)
      });

      this.codeMirror.on('changes', () => this.postProcessCodeMirror());

      this.codeMirror.focus();
    }
  }

  private validateUnsavedChanges() {
    return !this.isDirty || confirm("Are you sure? Changes you made will not be saved.");
  }

  private getNotesAutocomplete(cm: CodeMirror.Editor) {
    if (!cm) { return; }
    
    const cursor = cm.getCursor();
    const start = cursor.ch
    const end = cursor.ch;
    const options = this.noteService.getAll().map(x => x.path);
    
    cm.showHint({
      hint: () => {
        return {
          list: options,
          from: CodeMirror.Pos(cursor.line, start),
          to: CodeMirror.Pos(cursor.line, end)
        };
      }
    });
  }
  //#endregion
}
