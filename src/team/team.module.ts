import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { Angulartics2Module } from 'angulartics2';

import { TeamComponent } from './team.component';
import { TeamService } from './team.service';

import { TeamRouting } from './team.routing';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    TeamRouting,
    HttpModule,
    RouterModule,
    CommonModule,
    Angulartics2Module
  ],
  providers: [TeamService],
  exports: []
})

export class TeamModule {

}
