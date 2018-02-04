import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { PhotographerRouting } from './photographer.routing';

import { PhotographerComponent } from './photographer.component';

import { PhotographerPlacesComponent,
         PhotographerPlacesService } from './photographer-places';

import { PhotographerProfileComponent,
         PhotographerProfileService } from './photographer-profile';

@NgModule({
  declarations: [
    PhotographerComponent,
    PhotographerPlacesComponent,
    PhotographerProfileComponent
  ],
  imports: [
    PhotographerRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    PhotographerPlacesService,
    PhotographerProfileService
  ],
  exports: []
})

export class PhotographerModule {}
