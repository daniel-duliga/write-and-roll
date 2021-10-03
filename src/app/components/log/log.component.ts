import { Component, OnInit, ViewChild } from '@angular/core';
import { EasymdeComponent } from 'ngx-easymde';
import { EasymdeOptions } from 'ngx-easymde/src/config';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  @ViewChild('easymde', { static: true }) private readonly easymde!: EasymdeComponent;
  easyMdeOptions: EasymdeOptions = {
    // toolbar: false,
    // status: false,
  };
  logModel: any = '';
  currentLogValue: string = '';

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.logModel = this.easymde.Instance.codemirror;
    this.logModel.focus();
  }

  onLogChange(newValue: any): void {
    this.currentLogValue = newValue;
  }

  handleCommand(option: string): void {
    this.logModel.replaceSelection(option);
    this.logModel.focus();
  }
}
