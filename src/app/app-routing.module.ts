import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/notes/notes.component';
import { RandomTablesAddEditComponent } from './pages/random-tables/random-tables-add-edit/random-tables-add-edit.component';
import { RandomTablesComponent } from './pages/random-tables/random-tables.component';
import { TemplateAddEditComponent } from './pages/templates/template-add-edit/template-add-edit.component';
import { TemplatesComponent } from './pages/templates/templates.component';

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
        redirectTo: 'notes',
        pathMatch: 'full',
      },
      {
        path: 'notes',
        component: NotesComponent,
      },
      {
        path: 'templates',
        component: TemplatesComponent,
      },
      {
        path: 'templates/:id',
        component: TemplateAddEditComponent
      },
      {
        path: 'random-tables',
        component: RandomTablesComponent,
      },
      {
        path: 'random-tables/:id',
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
