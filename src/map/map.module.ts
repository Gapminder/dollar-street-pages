import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { MapService } from './map.service';

import { SharedModule } from '../shared';

import { MapRouting } from './map.routing';

import { Angulartics2Module } from 'angulartics2';

import { TranslateModule } from 'ng2-translate';

@NgModule({
  declarations: [MapComponent],
  imports: [
    MapRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    TranslateModule,
    SharedModule,
    Angulartics2Module
  ],
  providers: [MapService],
  exports: []
})

export class MapModule {}
