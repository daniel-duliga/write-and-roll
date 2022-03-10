import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SystemComponent } from './pages/system/system.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'systems/:id',
    component: SystemComponent,
  },
  {
    path: 'notes/:systemId/:noteId',
    component: SystemComponent,
  },
  {
    path: 'import-export',
    component: ImportExportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
