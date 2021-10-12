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
  @Input() mode: string = 'default';
  @Output() onChanged: EventEmitter<IEntity> = new EventEmitter();

  entity: IEntity = { name: '', rawContent: '' };
  folders: string[] = [];
  initialName: string = '';

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getDataFromRoute();
    this.folders = this.entityService.getAllFolderPaths();
  }

  private getDataFromRoute() {
    this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        const entity = this.entityService.get(name); 
        if (entity) {
          this.initialName = this.entity.name;
          this.entity = entity;
          this.onChanged.emit(entity);
        }
      }
    });
  }

  setName(name: string) {
    if (this.entity) {
      this.entity.name = name;
    }
  }

  onChange(): void {
    this.onChanged.emit(this.entity);
  }

  save() {
    const entitySaveWrapper = new EntitySaveWrapper(this.entity, this.initialName);
    
    const errors = entitySaveWrapper.validate();
    if (errors !== '') {
      alert(errors);
      return;
    }

    if (entitySaveWrapper.oldName && entitySaveWrapper.entity.name !== entitySaveWrapper.oldName) {
      this.entityService.delete(entitySaveWrapper.oldName);
    }
    this.entityService.create(entitySaveWrapper.entity.name, entitySaveWrapper.entity);
    this.snackBar.open('Saved successfully', undefined, { duration: 1000, verticalPosition: 'bottom' });
  }
}
