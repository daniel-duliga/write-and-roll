import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/database/db.service';
import { Note } from 'src/app/database/models/note';
import { System } from 'src/app/database/models/system';

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
    const systemId = this.route.snapshot.paramMap.get('systemId');
    if(systemId) {
      this.systemId = systemId;
      await this.loadData();
      await this.db.onChanges().on('change', _ => this.loadData());
    } else {
      // todo: error handling
    }
  }

  async loadData() {
    this.notes = await this.db.systemNotes.getAll(this.systemId);
  }

  async createNote(name: string) {
    this.db.systemNotes.create(new Note(name), this.systemId);
  }
}
