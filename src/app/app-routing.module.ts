import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    component: RandomTablesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
