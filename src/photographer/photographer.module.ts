import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { Angulartics2Module } from 'angulartics2';

import { PhotographerComponent } from './photographer.component';
import { PhotographerPlacesComponent, PhotographerPlacesService } from './photographer-places';
import { PhotographerProfileComponent, PhotographerProfileService } from './photographer-profile';

@NgModule({
  declarations: [
    PhotographerComponent,
    PhotographerPlacesComponent,
    PhotographerProfileComponent
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    Angulartics2Module.forRoot()
  ],
  providers: [
    PhotographerPlacesService,
    PhotographerProfileService
  ],
  exports: []
})

export class PhotographerModule {

}
