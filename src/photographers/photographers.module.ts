import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { Angulartics2Module } from 'angulartics2';

import { PhotographersComponent } from './photographers.component';
import { PhotographersService } from './photographers.service';
import { PhotographersFilterPipe } from './photographers-filter.pipe';

import { PhotographersRouting } from './photographers.routing';

import { TranslateModule } from 'ng2-translate';

@NgModule({
  declarations: [
    PhotographersComponent,
    PhotographersFilterPipe
  ],
  imports: [
    PhotographersRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    TranslateModule,
    Angulartics2Module
  ],
  providers: [PhotographersService],
  exports: []
})

export class PhotographersModule {

}
