import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteComponent } from './components/prompts/auto-complete/auto-complete.component';

import { EasymdeComponent } from 'ngx-easymde';
import { EasymdeOptions } from 'ngx-easymde/src/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trpg-spa';

  constructor() { }
  
  ngOnInit(): void { }
}
