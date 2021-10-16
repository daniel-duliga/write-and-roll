import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCreateEditComponent } from './components/actions/action-create-edit/action-create-edit.component';
import { ActionListComponent } from './components/actions/action-list/action-list.component';
import { ChronicleCreateEditComponent } from './components/chronicles/chronicle-create-edit/chronicle-create-edit.component';
import { ChronicleListComponent } from './components/chronicles/chronicle-list/chronicle-list.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { RandomTableCreateEditComponent } from './components/random-tables/random-table-create-edit/random-table-create-edit.component';
import { RandomTableListComponent } from './components/random-tables/random-table-list/random-table-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chronicles',
    pathMatch: 'full'
  },
  {
    path: 'chronicles',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ChronicleListComponent
      },
      {
        path: 'create-edit',
        component: ChronicleCreateEditComponent
      },
      {
        path: 'create-edit/:name',
        component: ChronicleCreateEditComponent
      },
    ]
  },
  {
    path: 'random-tables',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: RandomTableListComponent
      },
      {
        path: 'create-edit',
        component: RandomTableCreateEditComponent
      },
      {
        path: 'create-edit/:name',
        component: RandomTableCreateEditComponent
      },
    ]
  },
  {
    path: 'actions',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ActionListComponent
      },
      {
        path: 'create-edit',
        component: ActionCreateEditComponent
      },
      {
        path: 'create-edit/:name',
        component: ActionCreateEditComponent
      },
    ]
  },
  {
    path: 'import-export',
    component: ImportExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
