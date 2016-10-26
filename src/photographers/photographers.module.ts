import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { PhotographersComponent } from './photographers.component';
import { PhotographersService } from './photographers.service';
import { PhotographersFilterPipe } from './photographers-filter.pipe';

@NgModule({
  declarations: [
    PhotographersComponent,
    PhotographersFilterPipe
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule
  ],
  providers: [PhotographersService],
  exports: []
})

export class PhotographersModule {

}
