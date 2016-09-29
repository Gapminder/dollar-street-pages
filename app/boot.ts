import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Ng2ContentfulBlogModule } from 'ng2-contentful-blog';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { ContentfulService } from 'ng2-contentful';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { routing, routes } from './routes';
import { AppComponent } from './app.component';
import { AboutComponent, AboutService } from './about';
import { ArticleComponent, ArticleService } from './article';
import { BlogComponent } from './blog';
import {
  MatrixComponent,
  MatrixService,
  MatrixImagesComponent,
  MatrixViewBlockComponent,
  FamilyInfoService
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
  RowLoaderComponent,
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
  HomeIncomeFilterService,
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

const Constants = require('./constants');
const ContentfulConfig = require('./contentTypeIds.json');

declare var CONTENTFUL_ACCESS_TOKEN: string;
declare var CONTENTFUL_SPACE_ID: string;
declare var CONTENTFUL_HOST: string;

@NgModule({
  declarations: [
    AppComponent,
    /* About components */
    AboutComponent,

    /* Article components */
    ArticleComponent,

    /* Blog components */
    BlogComponent,

    /* Matrix components */
    MatrixComponent,
    MatrixImagesComponent,
    MatrixViewBlockComponent,

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
    RowLoaderComponent,
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
    Ng2ContentfulBlogModule,
    Angulartics2Module.forRoot(),
    InfiniteScrollModule,
    routing
  ],
  entryComponents: [BlogComponent],
  providers: [
    ContentfulService,
    Angulartics2GoogleAnalytics,
    AboutService,
    ArticleService,
    LoaderService,
    CountriesFilterService,
    FooterService,
    GuideService,
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
    HomeIncomeFilterService,
    HomeHeaderService,
    HomeMediaService,
    HomeMediaViewBlockService,
    CountryInfoService,
    CountryPlacesService,
    {
      provide: 'ContentfulConfiguration',
      useValue: {
        accessToken: CONTENTFUL_ACCESS_TOKEN,
        spaceId: CONTENTFUL_SPACE_ID,
        host: CONTENTFUL_HOST
      }
    },
    {provide: 'Routes', useValue: routes},
    {provide: 'DefaultArticleComponent', useValue: BlogComponent},
    {provide: 'ContentfulTypeIds', useValue: ContentfulConfig},
    {provide: 'Constants', useValue: Constants}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
