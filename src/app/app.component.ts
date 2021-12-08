import { Component, OnInit } from '@angular/core';
import { BlockService } from './modules/blocks/block.service';
import { ChronicleEntityService } from './modules/entities/services/chronicle-entity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(
    private newEntityService: BlockService,
    private chronicleService: ChronicleEntityService,
  ) { }

  ngOnInit(): void {
    const chronicles = this.chronicleService.getAllNonEmpty();
    this.newEntityService.initialize(chronicles);
  }
}
