import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HeaderWithoutFiltersComponent } from './header-without-filters/header.component';
import { RouterModule } from '@angular/router';
import { HeaderService } from './header/header.service';
import { HttpModule } from '@angular/http';
import { MainMenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';

import { SocialShareButtonsService } from './social-share-buttons/social-share-buttons.service';
import { SocialShareButtonsComponent } from './social-share-buttons/social-share-buttons.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderWithoutFiltersComponent,
    MainMenuComponent,
    SocialShareButtonsComponent
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule
  ],
  providers: [
    HeaderService,
    SocialShareButtonsService
  ],
  exports: [HeaderWithoutFiltersComponent]
})
export class SharedModule {

}
