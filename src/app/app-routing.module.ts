import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteManagerComponent } from './components/note-manager/note-manager.component';
import { ImportExportComponent } from './components/import-export/import-export.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: NoteManagerComponent,
    data: { editorMode: 'markdown' }
  },
  {
    path: 'import-export',
    component: ImportExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
