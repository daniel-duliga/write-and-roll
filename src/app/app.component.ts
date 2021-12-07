import { Component, OnInit } from '@angular/core';
import { BlockService } from './blocks/block.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(private newEntityService: BlockService) { }

  ngOnInit(): void {
    this.newEntityService.initialize();
  }
}
