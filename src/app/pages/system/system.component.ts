import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  systemId: string = '';
  notes: Note[] = [];

  constructor(
    public router: Router,
    private db: DbService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const systemId = routeParams.get('id');
    
    if(systemId) {
      this.systemId = systemId;
      await this.loadData();
      await this.db.onChanges().on('change', _ => this.loadData());
    } else {
      // ?
    }
  }

  async loadData() {
    this.notes = await this.db.systemNotes.getAll(this.systemId);
  }

  async createNote(name: string) {
    await this.db.systemNotes.create(new Note(name), this.systemId);
  }
}
