import { Component, OnInit } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor() {
    PouchDB.plugin(PouchDBFind);
  }

  ngOnInit(): void {
    
  }
}
