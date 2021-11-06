import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChronicleEntityService } from 'src/app/entities/services/chronicle-entity.service';

@Component({
  selector: 'app-chronicle-create-edit',
  templateUrl: './chronicle-create-edit.component.html',
  styleUrls: ['./chronicle-create-edit.component.css']
})
export class ChronicleCreateEditComponent implements OnInit {
  constructor(
    public entityService: ChronicleEntityService,
    private router: Router,
  ) { }

  ngOnInit(): void { }
  
  navigateBack() {
    this.router.navigate(['/chronicles']);
  }
}
