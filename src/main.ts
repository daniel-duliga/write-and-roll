import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//#region codemirror
import 'codemirror/mode/javascript/javascript';

import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/continuelist';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import './app/extensions/markdown-fold';

import 'codemirror/addon/edit/closebrackets';
//#endregion

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
