import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoteComponent } from './pages/note/note.component';
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
    path: 'systems/:systemId',
    component: SystemComponent,
  },
  {
    path: 'system-notes/:noteId',
    component: NoteComponent,
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
