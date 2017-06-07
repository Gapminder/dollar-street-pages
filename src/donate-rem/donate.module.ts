import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { DonateComponent } from './donate.component';
import { DonateService } from './donate.service';

@NgModule({
  declarations: [DonateComponent],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [DonateService],
  exports: []
})

export class DonateModule {

}
