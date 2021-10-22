// Core
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Third-party
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EasymdeModule } from 'ngx-easymde';

// Internal
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RandomTableCreateEditComponent } from './pages/random-tables/random-table-create-edit/random-table-create-edit.component';
import { RandomTableListComponent } from './pages/random-tables/random-table-list/random-table-list.component';
import { TreeComponent } from './components/tree/tree.component';
import { AutoCompletePromptComponent } from './components/prompts/auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './components/prompts/input/input.component';
import { AutoCompleteFieldComponent } from './components/fields/auto-complete-field/auto-complete-field.component';
import { ChronicleCreateEditComponent } from './pages/chronicles/chronicle-create-edit/chronicle-create-edit.component';
import { ChronicleListComponent } from './pages/chronicles/chronicle-list/chronicle-list.component';
import { ActionListComponent } from './pages/actions/action-list/action-list.component';
import { ActionCreateEditComponent } from './pages/actions/action-create-edit/action-create-edit.component';
import { EditorComponent } from './components/editor/editor.component';
import { ImportExportComponent } from './pages/import-export/import-export.component';
import { ChronicleEditorComponent } from './components/chronicle-editor/chronicle-editor.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompletePromptComponent,
    InputComponent,
    SidebarComponent,
    RandomTableCreateEditComponent,
    RandomTableListComponent,
    TreeComponent,
    AutoCompleteFieldComponent,
    ChronicleListComponent,
    ChronicleCreateEditComponent,
    ActionListComponent,
    ActionCreateEditComponent,
    EditorComponent,
    ImportExportComponent,
    ChronicleEditorComponent,
  ],
  imports: [
    // Core
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    CdkTreeModule,
    MatSnackBarModule,
    MatCheckboxModule,

    // Third-party
    CodemirrorModule,
    EasymdeModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
