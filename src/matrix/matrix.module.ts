import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { MatrixComponent } from './matrix.component';
import { MatrixService } from './matrix.service';

import { MatrixImagesComponent } from './matrix-images/matrix-images.component';
import { IsImageLoadedDirective } from './matrix-images/is-image-loaded.directive';

import { MatrixViewBlockComponent } from './matrix-view-block/matrix-view-block.component';
import { FamilyInfoService } from './matrix-view-block/matrix-view-block.service';

@NgModule({
  declarations: [
    MatrixComponent,
    MatrixImagesComponent,
    IsImageLoadedDirective,
    MatrixViewBlockComponent
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    SharedModule
  ],
  providers: [
    MatrixService,
    FamilyInfoService
  ],
  exports: []
})

export class MatrixModule {

}
