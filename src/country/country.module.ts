import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { Angulartics2Module } from 'angulartics2';

import { CountryComponent } from './country.component';
import { CountryInfoComponent, CountryInfoService } from './country-info';
import { CountryPlacesComponent, CountryPlacesService } from './country-places';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [
    CountryComponent,
    CountryInfoComponent,
    CountryPlacesComponent
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule,
    Angulartics2Module.forRoot()
  ],
  providers: [
    CountryInfoService,
    CountryPlacesService
  ],
  exports: []
})

export class CountryModule {

}
