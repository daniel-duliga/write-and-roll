import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  splitEdit: boolean = false;

  constructor( ) { }

  ngOnInit() { }

  toggleSplitEditor() {
    this.splitEdit = !this.splitEdit;
  }
}
