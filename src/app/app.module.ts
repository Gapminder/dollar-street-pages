import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule, HomeComponent } from '../shared';
import { CommonModule } from '../common';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

const routing = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    CommonModule,
    RouterModule,
    routing
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
