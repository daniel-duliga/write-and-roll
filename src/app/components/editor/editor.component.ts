import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror/codemirror.component';
import { LineWidget } from 'codemirror';
import { Item } from 'src/app/entities/models/item';
import { EntityService } from 'src/app/entities/services/entity.service';
import { EditorListService } from 'src/app/components/editor-list/editor-list.service';
import { CommandsComponent } from '../commands/commands.component';

export type MoveDirection = "left" | "right";
export type EditorMode = "markdown" | "javascript" | "default";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() name: string = ''; // only used for loading the initial entity
  @Input() mode: EditorMode = "default";
  @Input() minimized = false;
  @Input() entityService!: EntityService;

  @Output() onClosed: EventEmitter<void> = new EventEmitter();
  @Output() onMove: EventEmitter<MoveDirection> = new EventEmitter();
  @Output() onMinimized: EventEmitter<boolean> = new EventEmitter();
  @Output() onLinkClicked: EventEmitter<string> = new EventEmitter();

  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;
  @ViewChild('commands') commands!: CommandsComponent;

  entity: Item = new Item();
  initialContent: string = '';
  lineWidgets: LineWidget[] = [];

  //#region properties
  public get codeMirror(): CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }
  public get isDirty(): boolean {
    return this.entity.content !== this.initialContent;
  }
  public get formattedName(): string {
    const nameSegments = this.entity.path.split('/');
    return nameSegments[nameSegments.length - 1];
  }
  //#endregion

  constructor(
    private renderer: Renderer2,
    private uiService: EditorListService
  ) {
    (window as any).openLink = (entityId: string) => this.linkClicked(entityId);
  }

  //#region lifecycle events
  ngOnInit(): void {
    this.getAndSetEntity(this.name);
  }

  ngAfterViewInit() {
    this.configureCodeMirror();
    this.refresh();
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
    const existingItem = this.entityService.get(this.entity.content);
    if (!existingItem) {
      this.entityService.create(this.entity);
    } else {
      this.entityService.update(this.entity);
    }

    // Reflect saved data
    this.initialContent = this.entity.content;
  }

  linkClicked(entityId: string) {
    // this.onLinkClicked.emit(entityId);
    this.uiService.onEditorOpened.next(entityId);
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
    this.entity.path = name;
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
      
      let entityNameRegExMatch = linkContent.match(/\[.*\]/g);
      let entityIdRegExMatch = linkContent.match(/\(war:\/\/.*\)/g);
      if (entityIdRegExMatch && entityNameRegExMatch) {
        let entityName = entityNameRegExMatch.toString();
        entityName = entityName.slice(1, entityName.length - 1);
        
        let entityId = entityIdRegExMatch.toString();
        entityId = entityId.slice(7, entityId.length - 1);
      
        const linkIndexInLine = link.index ?? 0;
      
        // Highlight link name part
        this.codeMirror.getDoc().markText(
          { line: lineIndex, ch: linkIndexInLine },
          { line: lineIndex, ch: linkIndexInLine + entityName.length + 2 },
          {
            className: 'markdown-link',
            attributes: {
              'entityId': entityName,
              'onClick': `openLink('${entityId}')`
            }});

        // Hide link url part
        this.codeMirror.getDoc().markText(
          { line: lineIndex, ch: linkIndexInLine + entityNameRegExMatch.toString().length },
          { line: lineIndex, ch: linkIndexInLine + entityNameRegExMatch.toString().length + entityIdRegExMatch.toString().length },
          {
            collapsed: true,
          }
        )
      }
    }
  }
  //#endregion

  //#region private methods
  private getAndSetEntity(name: string) {
    const newEntity = this.entityService.get(name);
    if (newEntity) {
      this.entity = newEntity;
      this.initialContent = this.entity.content;
      this.entity.path = name;
    }
  }

  private configureCodeMirror() {
    if (this.codeMirror) {
      this.codeMirror.setOption("extraKeys", {
        Enter: function (cm) {
          cm.execCommand("newlineAndIndentContinueMarkdownList");
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
