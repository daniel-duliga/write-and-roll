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

// Third-party
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EasymdeModule } from 'ngx-easymde';

// Internal
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommandsComponent } from './components/commands/commands.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RandomTableCreateEditComponent } from './components/random-tables/random-table-create-edit/random-table-create-edit.component';
import { RandomTableListComponent } from './components/random-tables/random-table-list/random-table-list.component';
import { TreeComponent } from './components/tree/tree.component';
import { AutoCompletePromptComponent } from './components/prompts/auto-complete-prompt/auto-complete-prompt.component';
import { InputComponent } from './components/prompts/input/input.component';
import { AutoCompleteFieldComponent } from './components/fields/auto-complete-field/auto-complete-field.component';
import { ChronicleCreateEditComponent } from './components/chronicles/chronicle-create-edit/chronicle-create-edit.component';
import { ChronicleListComponent } from './components/chronicles/chronicle-list/chronicle-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompletePromptComponent,
    CommandsComponent,
    InputComponent,
    SidebarComponent,
    RandomTableCreateEditComponent,
    RandomTableListComponent,
    TreeComponent,
    AutoCompleteFieldComponent,
    ChronicleListComponent,
    ChronicleCreateEditComponent,
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

    // Third-party
    CodemirrorModule,
    EasymdeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
