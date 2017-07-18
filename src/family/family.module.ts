import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { FamilyRouting } from './family.routing';

import { FamilyComponent }  from './family.component';
import { FamilyService }  from './family.service';

import { FamilyHeaderComponent,
         FamilyHeaderService } from './family-header';

import { FamilyMediaComponent,
         FamilyMediaService } from './family-media';

import { FamilyMediaViewBlockComponent,
         FamilyMediaViewBlockService } from './family-media/family-media-view-block';

@NgModule({
  declarations: [
    FamilyComponent,
    FamilyHeaderComponent,
    FamilyMediaComponent,
    FamilyMediaViewBlockComponent
  ],
  imports: [
    FamilyRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    InfiniteScrollModule,
    SharedModule
  ],
  providers: [
    FamilyService,
    FamilyHeaderService,
    FamilyMediaService,
    FamilyMediaViewBlockService
  ],
  exports: []
})

export class FamilyModule {
}
