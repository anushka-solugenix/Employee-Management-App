import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { InfiniteRowModelModule } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule
]);

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
