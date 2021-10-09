import { Component, OnInit, ViewChild } from '@angular/core';
import { EasymdeComponent } from 'ngx-easymde';
import { EasymdeOptions } from 'ngx-easymde/src/config';

@Component({
  selector: 'app-log',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {
  @ViewChild('easymde', { static: true }) private readonly easymde!: EasymdeComponent;
  easyMdeOptions: EasymdeOptions = {
    status: false,
    uploadImage: true,
    spellChecker: false,
    sideBySideFullscreen: false
  };
  logModel: any = '';
  currentLogValue: string = '';

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.logModel = this.easymde.Instance.codemirror;
    this.logModel.focus();
  }

  onLogChange(newValue: any) {
    this.currentLogValue = newValue;
  }

  handleCommand(option: string) {
    this.logModel.replaceSelection(option);
    this.logModel.focus();
  }
}
