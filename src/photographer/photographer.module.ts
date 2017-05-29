import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

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
    SharedModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  providers: [
    PhotographerPlacesService,
    PhotographerProfileService
  ],
  exports: []
})

export class PhotographerModule {

}
