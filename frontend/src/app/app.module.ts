import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AgGridModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: []
})
export class AppModule { }
