import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EasymdeComponent } from 'ngx-easymde';
import { EasymdeOptions } from 'ngx-easymde/src/config';
import { Subject } from 'rxjs';
import { JournalStorageService } from 'src/app/storage/journal/journal-storage.service';
import { JournalWrapper } from 'src/app/storage/journal/journal.wrapper';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  folders: string[] = [];
  journal: JournalWrapper = new JournalWrapper();
  oldName: string = '';

  @ViewChild('easymde', { static: true }) private readonly easymde!: EasymdeComponent;
  easyMdeOptions: any = {
    status: false,
    uploadImage: true,
    spellChecker: false,
    sideBySideFullscreen: false,
    toolbar: ['image', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'],
  };

  logModel: any = '';

  commandsToggle: Subject<boolean> = new Subject();

  constructor(
    private journalService: JournalStorageService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
    this.folders = this.journalService.getAllFolderPaths();
  }
  
  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.journal = this.journalService.get(name);
        this.oldName = this.journal.name;
        this.logModel = this.journal.rawContent;
      }
    });
  }

  ngAfterViewInit() {
    this.logModel = this.easymde.Instance.codemirror;
    this.logModel.focus();
  }

  showCommands() {
    this.commandsToggle.next(true);
  }

  setName(name: string) {
    this.journal.name = name;
  }

  onLogChange(newValue: any) {
    this.journal.rawContent = newValue;
  }

  handleCommand(option: string) {
    this.logModel.replaceSelection(option);
    this.logModel.focus();
  }

  save() {
    // Validation
    let errors = '';

    if (this.journal.name.trim() === '') {
      errors += 'Name is required.\n';
    } else if (this.journal.name.trim().endsWith('/')) {
      errors += 'Name cannot end with "/".\n';
    }

    if (this.journal.rawContent.trim() === '') {
      errors += 'Content is required.\n';
    }

    if (errors !== '') {
      alert(errors);
      return;
    }

    // Save
    if (this.oldName) {
      this.journalService.delete(this.oldName);
    }

    this.journalService.create(this.journal.name, this.journal);

    this.snackBar.open('Saved successfully', undefined, { duration: 1000, verticalPosition: 'bottom' });
  }
}
