import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PagesConfig } from 'src/app/pages/pages-config';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentPage: any = {};

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.currentPage = PagesConfig.pages.filter(x => this.router.url.includes(x.link))[0];
        this.cdRef.detectChanges();
      }
    })
  }

  showSidebar() {
    this.sidebarService.showSidebar();
  }
}
