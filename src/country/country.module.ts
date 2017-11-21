import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { CountryRouting } from './country.routing';

import { CountryComponent } from './country.component';

import { CountryInfoComponent,
         CountryInfoService } from './country-info';

import { CountryPlacesComponent,
         CountryPlacesService } from './country-places';

@NgModule({
  declarations: [
    CountryComponent,
    CountryInfoComponent,
    CountryPlacesComponent
  ],
  imports: [
    CountryRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    CountryInfoService,
    CountryPlacesService
  ],
  exports: []
})

export class CountryModule {}
