import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IEntity } from 'src/app/storage/IEntity';
import { StorageServiceBase } from 'src/app/storage/storage.service';
import { EntitySaveWrapper } from './entity-save.wrapper';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() entityService!: StorageServiceBase;
  @Input() backLink: string = '';
  @Output() onSave: EventEmitter<EntitySaveWrapper> = new EventEmitter();
  
  entity: IEntity = { name: '', rawContent: '' };
  folders: string[] = [];
  oldName: string = '';

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getDataFromRoute();
    this.folders = this.entityService.getAllFolderPaths();
  }

  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        this.entity = this.entityService.get(name);
        if (this.entity) {
          this.oldName = this.entity.name;
        }
      }
    });
  }

  setName(name: string) {
    if (this.entity) {
      this.entity.name = name;
    }
  }

  save() {
    this.onSave.emit(new EntitySaveWrapper(this.entity, this.oldName));
  }
}
