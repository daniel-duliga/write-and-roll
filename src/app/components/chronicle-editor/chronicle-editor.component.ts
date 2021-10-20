import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { CommandService } from 'src/app/commands/command.service';
import { ChronicleStorageService } from 'src/app/storage/model-services/chronicle-storage.service';
import { Chronicle } from 'src/app/storage/models/chronicle';

@Component({
  selector: 'app-chronicle-editor',
  templateUrl: './chronicle-editor.component.html',
  styleUrls: ['./chronicle-editor.component.css']
})
export class ChronicleEditorComponent implements OnInit {
  allChronicles: string[] = [];
  chronicle: Chronicle = new Chronicle();
  initialName: string = '';
  
  @ViewChild('ngxCodeMirror', { static: true }) private readonly ngxCodeMirror!: CodemirrorComponent;

  public get codeMirror() : CodeMirror.EditorFromTextArea | undefined {
    return this.ngxCodeMirror.codeMirror;
  }

  constructor(
    public commandService: CommandService,
    public dialog: MatDialog,
    private chronicleStorageService: ChronicleStorageService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.allChronicles = this.chronicleStorageService.getAllPaths();
  }

  ngAfterViewInit() {
    this.getDataFromRoute();
    this.registerCodeMirrorExtraKeys();
  }

  @HostListener('keydown.control.space', ['$event'])
  async onShowCommands(e: Event) {
    this.showCommands();
  }

  @HostListener('keydown.control.s', ['$event'])
  onSave(e: Event) {
    this.save(e);
  }

  async showCommands() {
    const result = await this.commandService.showCommands(this.dialog);
    this.handleCommand(result);
  }

  setName(name: string) {
    this.chronicle.name = name;
  }

  changeChronicle(name: string) {
    this.getChronicle(name);
  }

  handleCommand(option: string) {
    if (option && this.ngxCodeMirror.codeMirror) {
      this.ngxCodeMirror.codeMirror.replaceSelection(`\`${option}\``);
    }
  }

  save($event: Event | null = null) {
    // If triggered by key combination, prevent default browser save action
    if ($event) {
      $event.preventDefault();
    }

    // Validation
    let errors = '';

    if (this.chronicle.name.trim() === '') {
      errors += 'Name is required.\n';
    } else if (this.chronicle.name.trim().endsWith('/')) {
      errors += 'Name cannot end with "/".\n';
    }

    if (this.chronicle.rawContent.trim() === '') {
      errors += 'Content is required.\n';
    }

    if (errors !== '') {
      alert(errors);
      return;
    }

    // Save
    if (this.initialName) {
      this.chronicleStorageService.delete(this.initialName);
    }

    this.chronicleStorageService.create(this.chronicle.name, this.chronicle.rawContent);

    this.snackBar.open('Saved successfully', undefined, { duration: 1000, verticalPosition: 'top' });
  }

  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.getChronicle(name);
      }
    });
  }

  private getChronicle(name: string) {
    const entity = this.chronicleStorageService.get(name);
    this.initialName = entity.name;
    this.chronicle = entity;
  }

  private registerCodeMirrorExtraKeys() {
    if (this.codeMirror) {
      this.codeMirror.setOption(
        "extraKeys", {
        Enter: function (cm) {
          cm.execCommand("newlineAndIndentContinueMarkdownList");
        }
      }
      );
    }
  }
}
