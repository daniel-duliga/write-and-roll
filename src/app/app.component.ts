import { Component, OnInit } from '@angular/core';
import { SidebarService } from './components/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'write-and-roll';

  constructor(
    public sidebarService: SidebarService
  ) { }
  
  ngOnInit(): void { }

  hideSidebar() {
    this.sidebarService.hideSidebar();
  }
}
