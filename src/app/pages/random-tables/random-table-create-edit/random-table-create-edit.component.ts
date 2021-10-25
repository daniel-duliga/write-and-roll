import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityEditorComponentBase } from 'src/app/entities/entity-editor-component-base';
import { RandomTableEntityService } from 'src/app/entities/services/random-table-entity.service';

@Component({
  selector: 'app-random-table-create-edit',
  templateUrl: './random-table-create-edit.component.html',
  styleUrls: ['./random-table-create-edit.component.css']
})
export class RandomTableCreateEditComponent extends EntityEditorComponentBase implements OnInit {

  constructor(
    public randomTableEntityService: RandomTableEntityService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.getDataFromRoute(this.route, this.randomTableEntityService);
  }

  closeEditor() {
    this.router.navigate(["/random-tables"]);
  }
}
