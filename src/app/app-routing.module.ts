import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCreateEditComponent } from './pages/actions/action-create-edit/action-create-edit.component';
import { ActionListComponent } from './pages/actions/action-list/action-list.component';
import { EntityEditorComponent } from './components/entity-editor/entity-editor.component';
import { ChronicleListComponent } from './pages/chronicles/chronicle-list/chronicle-list.component';
import { ImportExportComponent } from './pages/import-export/import-export.component';
import { RandomTableCreateEditComponent } from './pages/random-tables/random-table-create-edit/random-table-create-edit.component';
import { RandomTableListComponent } from './pages/random-tables/random-table-list/random-table-list.component';
import { ChronicleCreateEditComponent } from './pages/chronicles/chronicle-create-edit/chronicle-create-edit.component';

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
