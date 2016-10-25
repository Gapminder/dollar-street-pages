import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { TeamComponent } from './team.component';
import { TeamService } from './team.service';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule
  ],
  providers: [TeamService],
  exports: []
})

export class TeamModule {

}
