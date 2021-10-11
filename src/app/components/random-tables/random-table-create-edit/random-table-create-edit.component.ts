import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RandomTableService } from 'src/app/storage/random-table/random-table.service';
import { EntitySaveWrapper } from '../../editor/entity-save.wrapper';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent implements OnInit {

  constructor(
    public randomTableService: RandomTableService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() { }

  save(entitySaveWrapper: EntitySaveWrapper) {
    // Validation
    let errors = '';
    
    if (entitySaveWrapper.entity.name.trim() === '') {
      errors += 'Name is required.\n';
    } else if (entitySaveWrapper.entity.name.trim().endsWith('/')) {
      errors += 'Name cannot end with "/".\n';
    }
    
    if (entitySaveWrapper.entity.rawContent.trim() === '') {
      errors += 'Content is required.\n';
    }
    
    if (errors !== '') {
      alert(errors);
      return;
    }
    
    // Save
    if (entitySaveWrapper.oldName && entitySaveWrapper.entity.name !== entitySaveWrapper.oldName) {
      this.randomTableService.delete(entitySaveWrapper.oldName);
    }
    this.randomTableService.create(entitySaveWrapper.entity.name, entitySaveWrapper.entity.rawContent);
    this.snackBar.open('Saved successfully', undefined, { duration: 1000, verticalPosition: 'bottom' });
  }
}
