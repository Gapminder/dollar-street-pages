import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { MapComponent } from './map.component';
import { MapService } from './map.service';

@NgModule({
  declarations: [MapComponent],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [MapService],
  exports: []
})

export class MapModule {

}
