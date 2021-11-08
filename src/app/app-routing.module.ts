import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { ChronicleEntityService } from './entities/services/chronicle-entity.service';
import { RandomTableEntityService } from './entities/services/random-table-entity.service';
import { ActionEntityService } from './entities/services/action-entity.service';

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
    path: 'random-tables',
    component: EntityManagerComponent,
    data: { entityServiceToken: RANDOM_TABLE_ENTITY_SERVICE_TOKEN }
  },
  {
    path: 'actions',
    component: EntityManagerComponent,
    data: { entityServiceToken: ACTIONS_ENTITY_SERVICE_TOKEN, editorMode: 'javascript' }
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
    },
    {
      provide: RANDOM_TABLE_ENTITY_SERVICE_TOKEN,
      useClass: RandomTableEntityService,
    },
    {
      provide: ACTIONS_ENTITY_SERVICE_TOKEN,
      useClass: ActionEntityService,
    },
  ]
})
export class AppRoutingModule { }
