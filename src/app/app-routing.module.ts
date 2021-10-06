import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomTableCreateEditComponent } from './components/random-tables/random-table-create-edit/random-table-create-edit.component';
import { RandomTableListComponent } from './components/random-tables/random-table-list/random-table-list.component';
import { LogComponent } from './pages/log/log.component';
import { RandomTablesComponent } from './pages/random-tables/random-tables.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'log',
    pathMatch: 'full'
  },
  {
    path: 'log',
    component: LogComponent
  },
  {
    path: 'random-tables',
    component: RandomTablesComponent,
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
