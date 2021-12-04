// Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

// Angular Material
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// Third-party
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EasymdeModule } from 'ngx-easymde';

// Internal
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AutoCompleteFieldComponent } from './components/auto-complete-field/auto-complete-field.component';
import { AutoCompletePromptComponent } from './components/prompts/auto-complete-prompt/auto-complete-prompt.component';
import { EntityManagerComponent } from './components/entity-manager/entity-manager.component';
import { CommandsComponent } from './components/commands/commands.component';
import { EditorComponent } from './components/editor/editor.component';
import { EditorListComponent } from './components/editor-list/editor-list.component';
import { ImportExportComponent } from './components/import-export/import-export.component';
import { InputComponent } from './components/prompts/input/input.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TreeComponent } from './components/tree/tree.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompletePromptComponent,
    InputComponent,
    SidebarComponent,
    TreeComponent,
    AutoCompleteFieldComponent,
    EntityManagerComponent,
    EditorListComponent,
    ImportExportComponent,
    EditorComponent,
    CommandsComponent,
  ],
  imports: [
    // Core
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

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
    MatMenuModule,

    // Third-party
    CodemirrorModule,
    EasymdeModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
