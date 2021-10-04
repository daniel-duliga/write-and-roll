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

// Third-party
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EasymdeModule } from 'ngx-easymde';

// Internal
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutoCompleteComponent } from './components/prompts/auto-complete/auto-complete.component'
import { LogComponent } from './pages/log/log.component';
import { CommandsComponent } from './components/commands/commands.component';
import { InputComponent } from './components/prompts/input/input.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RandomTablesComponent } from './pages/random-tables/random-tables.component';
import { RandomTableCreateComponent } from './components/random-tables/random-table-create/random-table-create.component';
import { RandomTableListComponent } from './components/random-tables/random-table-list/random-table-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoCompleteComponent,
    LogComponent,
    CommandsComponent,
    InputComponent,
    SidebarComponent,
    RandomTablesComponent,
    RandomTableCreateComponent,
    RandomTableListComponent,
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

    // Third-party
    CodemirrorModule,
    EasymdeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
