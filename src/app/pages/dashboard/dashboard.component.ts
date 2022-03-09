import { Component, NgZone, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { DbService } from 'src/app/services/storage/db.service';
import { Campaign } from 'src/app/services/storage/models/campaign';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  campaignNames: string[] | null = null;

  constructor(
    private db: DbService,
  ) { }

  async ngOnInit() {
    await this.loadData();
    await this.db.onChanges().on('change', _ => this.loadData());
  }

  ngAfterViewInit() {
    
  }

  async loadData() {
    this.campaignNames = (await this.db.campaigns.getAll()).map(x => x.name);
  }

  async createCampaign(name: string) {
    await this.db.campaigns.create(new Campaign(name));
  }

}
