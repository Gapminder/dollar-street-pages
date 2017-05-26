import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { SharedModule } from '../shared';

import { MatrixComponent } from './matrix.component';
import { MatrixService } from './matrix.service';

import { MatrixImagesComponent } from './matrix-images/matrix-images.component';

import { MatrixViewBlockComponent } from './matrix-view-block/matrix-view-block.component';
import { FamilyInfoService } from './matrix-view-block/matrix-view-block.service';

@NgModule({
  declarations: [
    MatrixComponent,
    MatrixImagesComponent,
    MatrixViewBlockComponent
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  providers: [
    MatrixService,
    FamilyInfoService
  ],
  exports: []
})

export class MatrixModule {

}
