import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
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
  expanded = false;

  constructor() { }

  ngOnInit() { }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
