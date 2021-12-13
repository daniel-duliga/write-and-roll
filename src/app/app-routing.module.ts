import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { ImportExportComponent } from './components/import-export/import-export.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chronicles',
    pathMatch: 'full'
  },
  {
    path: 'chronicles',
    component: EntityManagerComponent,
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
