import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { EffectsModule } from '@ngrx/effects';

import { MatrixEffects } from '../matrix/ngrx/matrix.effects';

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
    SharedModule,
    EffectsModule.forFeature([MatrixEffects])
  ],
  providers: [
    CountryInfoService,
    CountryPlacesService
  ],
  exports: []
})

export class CountryModule {}
