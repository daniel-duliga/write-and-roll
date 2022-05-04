import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RandomTablesAddEditComponent } from './pages/random-tables/random-tables-add-edit/random-tables-add-edit.component';
import { RandomTablesComponent } from './pages/random-tables/random-tables.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  {
    path: 'app',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'random-tables',
        pathMatch: 'full',
      },
      {
        path: 'random-tables',
        component: RandomTablesComponent,
      },
      {
        path: 'random-tables/add',
        component: RandomTablesAddEditComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
