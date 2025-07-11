import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import {
  ModuleRegistry,
  ClientSideRowModelModule,
  _SharedRowSelectionModule,
  TextEditorModule,
  ValidationModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  _SharedRowSelectionModule,
  TextEditorModule,
  ValidationModule
]);

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
