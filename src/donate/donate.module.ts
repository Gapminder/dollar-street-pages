import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { TranslateModule } from 'ng2-translate';

import { DonateComponent } from './donate.component';
import { DonateService } from './donate.service';

import { DonateRouting } from './donate.routing';

@NgModule({
  declarations: [DonateComponent],
  imports: [
    DonateRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    TranslateModule
  ],
  providers: [DonateService],
  exports: []
})

export class DonateModule {

}
