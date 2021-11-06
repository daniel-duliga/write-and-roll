import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionEntityService } from 'src/app/entities/services/action-entity.service';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-action-create-edit',
  templateUrl: './action-create-edit.component.html',
  styleUrls: ['./action-create-edit.component.css']
})
export class ActionCreateEditComponent implements OnInit {
  constructor(
    public entityService: ActionEntityService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  navigateBack() {
    this.router.navigate(['/actions']);
  }
}
