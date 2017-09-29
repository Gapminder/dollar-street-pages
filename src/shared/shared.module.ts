import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';

import { MainMenuComponent } from './main-menu/main-menu.component';

import { SocialShareButtonsService } from './social-share-buttons/social-share-buttons.service';
import { SocialShareButtonsComponent } from './social-share-buttons/social-share-buttons.component';

import { FooterComponent } from './footer/footer.component';
import { FooterService } from './footer/footer.service';

import { FooterSpaceDirective } from './footer-space/footer-space.directive';

import { FloatFooterComponent } from './float-footer/float-footer.component';

import { SocialFollowButtonsComponent } from './social-follow-buttons/social-follow-buttons.component';

import { LoaderComponent } from './loader/loader.component';

import { ThingsFilterComponent } from './things-filter/things-filter.component';
import { ThingsFilterService } from './things-filter/things-filter.service';
import { ThingsFilterPipe } from './things-filter/things-filter.pipe';

import { CountriesFilterComponent } from './countries-filter/countries-filter.component';
import { CountriesFilterPipe } from './countries-filter/countries-filter.pipe';
import { CountriesFilterService } from './countries-filter/countries-filter.service';

import { GuideComponent } from './guide/guide.component';
import { GuideService } from './guide/guide.service';

import { BubbleComponent } from './guide/bubble/bubble.component';

import { StreetComponent } from './street/street.component';
import { StreetDrawService } from './street/street.service';

import { StreetMobileComponent } from './street-mobile/street-mobile.component';
import { StreetMobileDrawService } from './street-mobile/street-mobile.service';

import { StreetFilterComponent } from './street-filter/street-filter.component';
import { StreetFilterDrawService } from './street-filter/street-filter.service';

import { StreetFamilyComponent } from './street-family/street-family.component';
import { StreetFamilyDrawService } from './street-family/street-family.service';

import { StreetPinnedComponent } from './street-pinned/street-pinned.component';
import { StreetPinnedDrawService } from './street-pinned/street-pinned.service';

import { IncomeFilterComponent } from './income-filter/income-filter.component';

import { IsImageLoadedDirective } from './is-image-loaded/is-image-loaded.directive';

import { LanguageSelectorComponent } from './language-selector/language-selector.component';

import { TranslateMeComponent } from './translate-me/translate-me.component';

import { RegionMapComponent } from './region-map/region-map.component';

import { DropdownModule } from 'ng2-bootstrap/components/dropdown';

import { TranslateModule } from 'ng2-translate';

import { Angulartics2Module } from 'angulartics2';

@NgModule({
  imports: [
    HttpModule,
    RouterModule,
    CommonModule,
    DropdownModule,
    Angulartics2Module,
    TranslateModule,
    FormsModule
  ],
  declarations: [
    LanguageSelectorComponent,
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
    StreetFamilyComponent,
    IncomeFilterComponent,
    IsImageLoadedDirective,
    TranslateMeComponent,
    StreetPinnedComponent
  ],
  providers: [
    SocialShareButtonsService,
    FooterService,
    CountriesFilterService,
    ThingsFilterService,
    GuideService,
    StreetDrawService,
    StreetMobileDrawService,
    StreetFilterDrawService,
    StreetFamilyDrawService,
    StreetPinnedDrawService
  ],
  exports: [
    RouterModule,
    Angulartics2Module,
    TranslateModule,
    LanguageSelectorComponent,
    FooterComponent,
    RegionMapComponent,
    FloatFooterComponent,
    LoaderComponent,
    FooterSpaceDirective,
    HeaderComponent,
    GuideComponent,
    SocialFollowButtonsComponent,
    SocialShareButtonsComponent,
    StreetComponent,
    StreetMobileComponent,
    StreetFilterComponent,
    StreetFamilyComponent,
    IncomeFilterComponent,
    MainMenuComponent,
    IsImageLoadedDirective,
    TranslateMeComponent,
    StreetPinnedComponent
  ]
})
export class SharedModule {}
