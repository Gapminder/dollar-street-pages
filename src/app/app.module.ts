import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule, HomeComponent } from '../shared';
import { CommonModule } from '../common';
import { Angulartics2Module } from 'angulartics2';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

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
    Angulartics2Module.forRoot(),
    routing
  ],
  providers: [
    Angulartics2GoogleAnalytics
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
