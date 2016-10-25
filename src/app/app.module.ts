import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from '../routes';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';
import { CommonAppModule } from '../common';

import { TeamModule } from '../team';
import { PhotographersModule } from '../photographers';
import { PhotographerModule } from '../photographer';
import { CountryModule } from '../country';
import { MapModule } from '../map';
import { ArticleModule } from '../article';
import { MatrixModule } from '../matrix';

import { Angulartics2Module } from 'angulartics2';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    CommonAppModule,
    RouterModule,
    TeamModule,
    PhotographersModule,
    PhotographerModule,
    CountryModule,
    MapModule,
    ArticleModule,
    MatrixModule,
    Angulartics2Module.forRoot(),
    routing
  ],
  providers: [
    Angulartics2GoogleAnalytics
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
