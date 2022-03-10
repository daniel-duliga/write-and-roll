import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/database/db.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {

  constructor(
    private db: DbService,
  ) { }

  async ngOnInit() {
    await this.loadData();
    await this.db.onChanges().on('change', _ => this.loadData());
  }

  async loadData() {
    
  }
}
