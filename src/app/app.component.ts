import { Component, OnInit } from '@angular/core';
import { NewEntityService } from './services/new-entity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(private newEntityService: NewEntityService) { }

  ngOnInit(): void {
    this.newEntityService.initialize();
  }
}
