import { NgModule } from '@angular/core';

import { HeaderWithoutFiltersComponent } from './header-without-filters/header.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { HeaderService } from './header/header.service';

import { MainMenuComponent } from './menu/menu.component';

import { SocialShareButtonsService } from './social-share-buttons/social-share-buttons.service';
import { SocialShareButtonsComponent } from './social-share-buttons/social-share-buttons.component';

import { FooterComponent } from './footer/footer.component';
import { FooterService } from './footer/footer.service';
import { FooterSpaceDirective } from './footer-space/footer-space.directive';

import { RegionMapComponent } from './region-map/region-map.component';

import { FloatFooterComponent } from './float-footer/float-footer.component';

import { SocialFollowButtonsComponent } from './social-follow-buttons/social-follow-buttons.component';

import { LoaderComponent } from './loader/loader.component';

import { ThingsFilterComponent } from './things-filter/things-filter.component';
import { ThingsFilterService } from './things-filter/things-filter.service';
import { ThingsFilterPipe } from './things-filter/things-filter.pipe';

import { CountriesFilterComponent } from './countries-filter/countries-filter.component';
import { CountriesFilterPipe } from './countries-filter/countries-filter.pipe';

import { GuideComponent } from './guide/guide.component';
import { GuideService } from './guide/guide.service';

import { BubbleComponent } from './guide/bubble/bubble.component';

import { StreetComponent } from './street/street.component';
import { StreetDrawService } from './street/street.service';

import { StreetMobileComponent } from './street-mobile/street-mobile.component';
import { StreetMobileDrawService } from './street-mobile/street-mobile.service';

import { StreetFilterComponent } from './street-filter/street-filter.component';
import { StreetFilterDrawService } from './street-filter/street-filter.service';

import { IncomeFilterComponent } from './income-filter/income-filter.component';
import { IsImageLoadedDirective } from './is-image-loaded/is-image-loaded.directive';

@NgModule({
  declarations: [
    HeaderWithoutFiltersComponent,
    MainMenuComponent,
    SocialShareButtonsComponent,
    FooterComponent,
    SocialFollowButtonsComponent,
    RegionMapComponent,
    FloatFooterComponent,
    LoaderComponent,
    FooterSpaceDirective,
    HeaderComponent,
    ThingsFilterComponent,
    ThingsFilterPipe,
    CountriesFilterComponent,
    CountriesFilterPipe,
    GuideComponent,
    BubbleComponent,
    StreetComponent,
    StreetMobileComponent,
    StreetFilterComponent,
    IncomeFilterComponent,
    IsImageLoadedDirective
  ],
  imports: [
    HttpModule,
    RouterModule,
    CommonModule
  ],
  providers: [
    HeaderService,
    SocialShareButtonsService,
    FooterService,
    ThingsFilterService,
    GuideService,
    StreetDrawService,
    StreetMobileDrawService,
    StreetFilterDrawService
  ],
  exports: [
    HeaderWithoutFiltersComponent,
    FooterComponent,
    RegionMapComponent,
    FloatFooterComponent,
    LoaderComponent,
    FooterSpaceDirective,
    HeaderComponent,
    GuideComponent,
    StreetComponent,
    StreetMobileComponent,
    StreetFilterComponent,
    IncomeFilterComponent,
    MainMenuComponent,
    IsImageLoadedDirective
  ]
})

export class SharedModule {

}
