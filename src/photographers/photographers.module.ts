import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';

import { Angulartics2Module } from 'angulartics2';

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
    CommonModule,
    SharedModule,
    Angulartics2Module.forRoot()
  ],
  providers: [PhotographersService],
  exports: []
})

export class PhotographersModule {

}
