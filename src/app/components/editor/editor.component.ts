import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { LineWidget, Pos } from 'codemirror';
import { EditorListService } from 'src/app/components/editor-list/editor-list.service';
import { Note } from 'src/app/modules/notes/models/note';
import { NoteService } from 'src/app/modules/notes/services/note.service';
import { CommandsComponent } from '../commands/commands.component';

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

  @Output() onClosed: EventEmitter<void> = new EventEmitter();
  @Output() onMove: EventEmitter<MoveDirection> = new EventEmitter();
  @Output() onMinimized: EventEmitter<boolean> = new EventEmitter();
  @Output() onLinkClicked: EventEmitter<string> = new EventEmitter();

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
    private uiService: EditorListService,
    private noteService: NoteService,
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
  closeEditor() {
    if (this.validateUnsavedChanges()) {
      this.onClosed.emit();
    }
  }

  toggleMinimize(minimized: boolean) {
    this.minimized = minimized;
    this.onMinimized.emit(minimized);
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

  linkClicked(noteId: string) {
    this.uiService.onEditorOpened.next(noteId);
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

  //#region codemirror postprocessing
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

    var textMarkers = this.codeMirror.getAllMarks();
    for (const textMarker of textMarkers) {
      textMarker.clear();
    }
  }

  private processCodemirrorLines() {
    if (!this.codeMirror) { return; }

    const linesCount = this.codeMirror.lineCount();
    for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
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

    const links = line.matchAll(/\[[\w]+[^\)]+\]\(war:\/\/[\w\s/]+\)/g);
    for (const link of links) {
      var linkContent = link.toString();

      let noteNameRegExMatch = linkContent.match(/\[.*\]/g);
      let noteIdRegExMatch = linkContent.match(/\(war:\/\/.*\)/g);
      if (noteIdRegExMatch && noteNameRegExMatch) {
        let noteName = noteNameRegExMatch.toString();
        noteName = noteName.slice(1, noteName.length - 1);

        let notePath = noteIdRegExMatch.toString();
        notePath = notePath.slice(7, notePath.length - 1);

        const linkIndexInLine = link.index ?? 0;

        // Highlight link name part
        this.codeMirror.getDoc().markText(
          { line: lineIndex, ch: linkIndexInLine },
          { line: lineIndex, ch: linkIndexInLine + noteName.length + 2 },
          {
            className: 'markdown-link',
            attributes: {
              'notePath': noteName,
              'onClick': `openLink('${notePath}')`
            }
          });

        // Hide link url part
        this.codeMirror.getDoc().markText(
          { line: lineIndex, ch: linkIndexInLine + noteNameRegExMatch.toString().length },
          { line: lineIndex, ch: linkIndexInLine + noteNameRegExMatch.toString().length + noteIdRegExMatch.toString().length },
          {
            collapsed: true,
          }
        )
      }
    }
  }
  //#endregion

  //#region private methods
  private getAndSetNote(name: string) {
    const newNote = this.noteService.get(name);
    if (newNote) {
      this.note = newNote;
      this.initialContent = this.note.content;
      this.note.path = name;
    }
  }

  private foldIndex = {};
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
            if(cm.isFolded(new Pos(lineIndex))) {
              currentMode = "unfold";
              break;
            }
          }
          
          for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
            cm.foldCode(lineIndex, undefined, currentMode);
          }
        }
      });

      this.codeMirror.on('changes', () => this.postProcessCodeMirror());

      this.codeMirror.focus();
    }
  }

  private validateUnsavedChanges() {
    return !this.isDirty || confirm("Are you sure? Changes you made will not be saved.");
  }
  //#endregion
}
