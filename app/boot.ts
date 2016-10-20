import { NgModule, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { routing, routes } from './routes';
import { AppComponent } from './app.component';
import { AboutComponent, AboutService } from './about';
import { ArticleComponent, ArticleService } from './article';
import {
  MatrixComponent,
  MatrixService,
  MatrixImagesComponent,
  MatrixViewBlockComponent,
  FamilyInfoService,
  IsImageLoadedDirective
} from './matrix';
import {
  CountriesFilterComponent,
  CountriesFilterPipe,
  CountriesFilterService,
  FooterComponent,
  FooterService,
  FloatFooterComponent,
  FooterSpaceDirective,
  GuideComponent,
  GuideService,
  LocalStorageService,
  BubbleComponent,
  HeaderComponent,
  HeaderService,
  HeaderWithoutFiltersComponent,
  IncomeFilterComponent,
  IncomesFilterComponent,
  LoaderComponent,
  LoaderService,
  MathService,
  MainMenuComponent,
  RegionMapComponent,
  SocialShareButtonsComponent,
  SocialShareButtonsService,
  SocialFollowButtonsComponent,
  StreetComponent,
  StreetDrawService,
  StreetSettingsService,
  StreetFilterComponent,
  StreetFilterDrawService,
  StreetMobileComponent,
  StreetMobileDrawService,
  ThingsFilterComponent,
  ThingsFilterPipe,
  ThingsFilterService,
  TitleHeaderService,
  UrlChangeService
} from './common';
import {
  CountryComponent,
  CountryInfoComponent,
  CountryInfoService,
  CountryPlacesComponent,
  CountryPlacesService
} from './country';
import {
  HomeComponent,
  HomeHeaderComponent,
  HomeHeaderService,
  HomeMediaComponent,
  HomeMediaService,
  HomeMediaViewBlockComponent,
  HomeMediaViewBlockService
} from './home';
import { MapComponent, MapService } from './map';
import {
  PhotographerComponent,
  PhotographerPlacesComponent,
  PhotographerPlacesService,
  PhotographerProfileComponent,
  PhotographerProfileService
} from './photographer';
import { PhotographersComponent, PhotographersService, PhotographersFilter } from './photographers';
import { TeamComponent, TeamService } from './team';

declare const ENV:string;

if (ENV === 'production') {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    /* About components */
    AboutComponent,

    /* Article components */
    ArticleComponent,

    /* Matrix components */
    MatrixComponent,
    MatrixImagesComponent,
    MatrixViewBlockComponent,
    IsImageLoadedDirective,

    /* Common components */
    CountriesFilterComponent,
    CountriesFilterPipe,
    FooterComponent,
    FloatFooterComponent,
    FooterSpaceDirective,
    GuideComponent,
    BubbleComponent,
    HeaderComponent,
    HeaderWithoutFiltersComponent,
    IncomeFilterComponent,
    IncomesFilterComponent,
    LoaderComponent,
    MainMenuComponent,
    RegionMapComponent,
    SocialShareButtonsComponent,
    SocialFollowButtonsComponent,
    StreetComponent,
    StreetFilterComponent,
    StreetMobileComponent,
    ThingsFilterComponent,
    ThingsFilterPipe,

    /* Country components */
    CountryComponent,
    CountryInfoComponent,
    CountryPlacesComponent,

    /* Home components */
    HomeComponent,
    HomeHeaderComponent,
    HomeMediaComponent,
    HomeMediaViewBlockComponent,

    /* Map components */
    MapComponent,

    /* Photographer components */
    PhotographerComponent,
    PhotographerPlacesComponent,
    PhotographerProfileComponent,

    /* Photographers components */
    PhotographersComponent,
    PhotographersFilter,

    /* Team components */
    TeamComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    Angulartics2Module.forRoot(),
    InfiniteScrollModule,
    routing
  ],
  providers: [
    Angulartics2GoogleAnalytics,
    AboutService,
    ArticleService,
    LoaderService,
    CountriesFilterService,
    FooterService,
    GuideService,
    LocalStorageService,
    HeaderService,
    MathService,
    SocialShareButtonsService,
    StreetDrawService,
    StreetSettingsService,
    StreetFilterDrawService,
    StreetMobileDrawService,
    ThingsFilterService,
    TitleHeaderService,
    UrlChangeService,
    MatrixService,
    FamilyInfoService,
    MapService,
    TeamService,
    PhotographersService,
    PhotographerPlacesService,
    PhotographerProfileService,
    HomeHeaderService,
    HomeMediaService,
    HomeMediaViewBlockService,
    CountryInfoService,
    CountryPlacesService,
    {provide: 'Routes', useValue: routes}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
