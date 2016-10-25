import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { FamilyComponent } from '../family';
import { FamilyHeaderComponent } from '../family';
import { FamilyMediaComponent } from '../family';
import { FamilyMediaViewBlockComponent } from '../family';
import { FamilyMediaService } from '../family';
import { FamilyMediaViewBlockService } from '../family';
import { FamilyHeaderService } from '../family';

import { SharedModule } from '../shared';
import { CommonModule } from '../common';
import { Angulartics2Module } from 'angulartics2';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

const routes: Routes = [
  { path: '', component: FamilyComponent }
];

const routing = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    AppComponent,
    FamilyComponent,
    FamilyHeaderComponent,
    FamilyMediaComponent,
    FamilyMediaViewBlockComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    CommonModule,
    RouterModule,
    Angulartics2Module.forRoot(),
    routing
  ],
  providers: [
    Angulartics2GoogleAnalytics,
    FamilyMediaService,
    FamilyMediaViewBlockService,
    FamilyHeaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
