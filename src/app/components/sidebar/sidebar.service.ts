import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  sidebarVisible = false;

  constructor() { }

  showSidebar() {
    this.sidebarVisible = true;
  }

  hideSidebar() {
    this.sidebarVisible = false;
  }
}
