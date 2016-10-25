import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { FamilyComponent }  from './family.component';
import { FamilyHeaderComponent } from './family-header/family-header.component';
import { FamilyHeaderService } from './family-header/family-header.service';
import { FamilyMediaComponent } from './family-media/family-media.component';
import { FamilyMediaService } from './family-media/family-media.service';
import { FamilyMediaViewBlockComponent } from './family-media/family-media-view-block/family-media-view-block.component';
import { FamilyMediaViewBlockService } from './family-media/family-media-view-block/family-media-view-block.service';

@NgModule({
  declarations: [
    FamilyComponent,
    FamilyHeaderComponent,
    FamilyMediaComponent,
    FamilyMediaViewBlockComponent
  ],
  imports: [
  HttpModule,
  RouterModule,
  CommonModule
  ],
  providers: [
    FamilyHeaderService,
    FamilyMediaService,
    FamilyMediaViewBlockService
  ],
  exports: []
})

export class FamilyModule {
}
