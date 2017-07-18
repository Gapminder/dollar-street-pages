import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { SharedModule } from '../shared';

import { MatrixComponent } from './matrix.component';
import { MatrixService } from './matrix.service';

import { MatrixImagesComponent } from './matrix-images';

import { MatrixViewBlockComponent,
         MatrixViewBlockService } from './matrix-view-block';

@NgModule({
  declarations: [
    MatrixComponent,
    MatrixImagesComponent,
    MatrixViewBlockComponent
  ],
  imports: [
    HttpModule,
    CommonModule,
    SharedModule,
    InfiniteScrollModule
  ],
  providers: [
    MatrixService,
    MatrixViewBlockService
  ],
  exports: []
})

export class MatrixModule {}
