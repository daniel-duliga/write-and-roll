import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { ChronicleEntityService } from './modules/entities/services/chronicle-entity.service';

export const CHRONICLE_ENTITY_SERVICE_TOKEN = new InjectionToken<string>("CHRONICLES_SERVICE_TOKEN");
export const RANDOM_TABLE_ENTITY_SERVICE_TOKEN = new InjectionToken<string>("RANDOM_TABLES_SERVICE_TOKEN");
export const ACTIONS_ENTITY_SERVICE_TOKEN = new InjectionToken<string>("ACTIONS_SERVICE_TOKEN");

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chronicles',
    pathMatch: 'full'
  },
  {
    path: 'chronicles',
    component: EntityManagerComponent,
    data: { entityServiceToken: CHRONICLE_ENTITY_SERVICE_TOKEN, editorMode: 'markdown' }
  },
  {
    path: 'import-export',
    component: ImportExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: CHRONICLE_ENTITY_SERVICE_TOKEN,
      useClass: ChronicleEntityService,
    }
  ]
})
export class AppRoutingModule { }
