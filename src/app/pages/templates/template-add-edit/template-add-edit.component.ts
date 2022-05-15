import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Template } from 'src/app/database/models/template';

import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import {javascript} from "@codemirror/lang-javascript"

@Component({
  selector: 'app-template-add-edit',
  templateUrl: './template-add-edit.component.html',
  styleUrls: ['./template-add-edit.component.css']
})
export class TemplateAddEditComponent implements OnInit, AfterViewInit {
  template: Template = new Template();
  @ViewChild("codemirrorhost") codemirrorhost!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    let editor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript()]
      }),
      parent: this.codemirrorhost.nativeElement
    });
  }

  save() {

  }
}
