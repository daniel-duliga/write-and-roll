import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Campaign } from 'src/app/database/models/campaign';
import { System } from 'src/app/database/models/system';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  campaigns: Campaign[] = [];
  systems: System[] = [];

  constructor(
    private db: DbService,
    public router: Router
  ) { }

  // lifecycle
  async ngOnInit() {
    await this.loadData();
    await this.db.onChanges().on('change', _ => this.loadData());
  }
  ngAfterViewInit() { }

  // events
  async createCampaign(name: string) {
    await this.db.campaigns.create(new Campaign(name));
  }
  async createSystem(name: string) {
    await this.db.systems.create(new System(name));
  }

  // private methods
  async loadData() {
    this.campaigns = await this.db.campaigns.getAll();
    this.systems = await this.db.systems.getAll();
  }
}
