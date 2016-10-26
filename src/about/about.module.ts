import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AboutComponent } from './about.component';
import { AboutService } from './about.service';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule
  ],
  providers: [AboutService],
  exports: []
})

export class AboutModule {

}
