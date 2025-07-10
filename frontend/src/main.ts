import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ColumnApiModule, ModuleRegistry, TextEditorModule } from 'ag-grid-community';
import { ClientSideRowModelModule, _SharedRowSelectionModule } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  _SharedRowSelectionModule,
  TextEditorModule,
  ColumnApiModule,
]);

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
