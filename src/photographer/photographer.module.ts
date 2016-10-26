import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  providers: [
    PhotographerPlacesService,
    PhotographerProfileService
  ],
  exports: []
})

export class PhotographerModule {

}
