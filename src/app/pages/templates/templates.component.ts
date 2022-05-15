import { Component, OnInit } from '@angular/core';
import { Template } from 'src/app/database/models/template';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [{ name: 'foo', content: 'bar', _id: '', _rev: '' }];
  displayedColumns = ['name', 'actions'];

  constructor() { }

  ngOnInit(): void {
  }

  edit(template: any) {

  }

}
