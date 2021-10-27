import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagesConfig } from '../../pages/pages-config';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  expanded = true;
  inBetween = false;
  minimized = false;
  items = PagesConfig.pages;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) { }

  ngOnInit() { }

  navigate(link: string) {
    this.router.navigate([link]);
    this.sidebarService.hideSidebar();
  }

  toggleExpand() {
    if (!this.expanded) {
      if (this.inBetween) {
        this.minimized = true;
      } else {
        this.inBetween = false;
        this.expanded = true;
      }
    } else {
      this.expanded = false;
      this.inBetween = true;
    }
  }

  toggleMinimize() {
    if (!this.minimized) {
      this.minimized = true;
    } else {
      this.inBetween = false;
      this.minimized = false;
    }
  }
}
