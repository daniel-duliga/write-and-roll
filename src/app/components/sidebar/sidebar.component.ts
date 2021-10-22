import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  expanded = false;
  inBetween = false;
  minimized = false;
  items: { link: string, tooltip: string, icon: string, text: string }[] = [
    {
      link: "/chronicles",
      tooltip: "Chronicle",
      icon: 'book',
      text: 'Chronicles'
    },
    {
      link: "/random-tables",
      tooltip: "Random Tables",
      icon: 'view_list',
      text: 'Random Tables'
    },
    {
      link: "/actions",
      tooltip: "Actions",
      icon: 'code',
      text: 'Actions'
    },
    {
      link: "/import-export",
      tooltip: "Import/Export",
      icon: 'save',
      text: 'Import/Export'
    },
  ];

  constructor() { }

  ngOnInit() { }

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
