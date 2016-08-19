import { ComponentRef, PLATFORM_DIRECTIVES } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { StreetDrawService } from './common/street/street.service';
import { StreetMobileDrawService } from './common/street-mobile/street-mobile.service';
import { MathService } from './common/math-service/math-service';
import { MatrixService } from './matrix/matrix.service';
import { HeaderService } from './common/header/header.service';
import { StreetSettingsService } from './common/street/street.settings.service';
import { HomeIncomeFilterService } from './home/home-income-filter.service';
import { FooterService } from './common/footer/footer.service';
import { GuideService } from './common/guide/guide.service';
import { ThingsFilterService } from './common/things-filter/things-filter.service';
import { CountriesFilterService } from './common/countries-filter/countries-filter.service';
import { CountryInfoService } from './country/country-info/country-info.service';
import { CountryPlacesService } from './country/country-places/country-places.service';
import { MapService } from './map/map.service';
import { UrlChangeService } from './common/url-change/url-change.service';
import { PhotographersService } from './all-photographers/photographers/photographers.service';
import { PhotographerProfileService } from './photographer/photographer-profile/photographer-profile.service';
import { PhotographerPlacesService } from './photographer/photographer-places/photographer-places.service';
import { TeamListService } from './team/team-list/team-list.service';
import { SocialShareButtonsService } from './common/social_share_buttons/social-share-buttons.service';
import { InfoContextService } from './info/info-context/info-context.service';
import { ArticleService } from './article/article.service';
import { FamilyInfoService } from './matrix/matrix-view-block/matrix-view-block.service';
import { HomeHeaderService } from './home/home-header/home-header.service';
import { HomeMediaService } from './home/home-media/home-media.service';
import { HomeMediaViewBlockService } from './home/home-media/home-media-view-block/home-media-view-block.service';
import { ContentfulService, Ng2ContentfulConfig } from 'ng2-contentful';
import { BlogComponent } from './blog/blog.component';
import { appInjector, GAPMINDER_PROVIDERS, ContentfulImageDirective } from 'ng2-contentful-blog';
import { Angulartics2, Angulartics2On } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { Config } from './app.config';

const Constants = require('./constants.json');
const ContentfulConfig = require('./contentTypeIds.json');
declare var CONTENTFUL_ACCESS_TOKEN: string;
declare var CONTENTFUL_SPACE_ID: string;
declare var CONTENTFUL_HOST: string;

// contentful config
Ng2ContentfulConfig.config = {
  accessToken: CONTENTFUL_ACCESS_TOKEN,
  space: CONTENTFUL_SPACE_ID,
  host: CONTENTFUL_HOST
};

bootstrap(AppComponent, [
  Angulartics2,
  HTTP_PROVIDERS,
  GAPMINDER_PROVIDERS,
  provideRouter(Config.routes),
  {provide: 'StreetDrawService', useClass: StreetDrawService},
  {provide: 'StreetMobileDrawService', useClass: StreetMobileDrawService},
  {provide: 'MatrixService', useClass: MatrixService},
  {provide: 'HeaderService', useClass: HeaderService},
  {provide: 'StreetSettingsService', useClass: StreetSettingsService},
  {provide: 'HomeIncomeFilterService', useClass: HomeIncomeFilterService},
  {provide: 'FooterService', useClass: FooterService},
  {provide: 'GuideService', useClass: GuideService},
  {provide: 'MapService', useClass: MapService},
  {provide: 'UrlChangeService', useClass: UrlChangeService},
  {provide: 'PhotographerProfileService', useClass: PhotographerProfileService},
  {provide: 'PhotographerPlacesService', useClass: PhotographerPlacesService},
  {provide: 'TeamListService', useClass: TeamListService},
  {provide: 'CountryInfoService', useClass: CountryInfoService},
  {provide: 'CountryPlacesService', useClass: CountryPlacesService},
  {provide: 'PhotographersService', useClass: PhotographersService},
  {provide: 'SocialShareButtonsService', useClass: SocialShareButtonsService},
  {provide: 'InfoContextService', useClass: InfoContextService},
  {provide: 'ArticleService', useClass: ArticleService},
  {provide: 'ContentfulService', useClass: ContentfulService},
  {provide: 'FamilyInfoService', useClass: FamilyInfoService},
  {provide: 'ThingsFilterService', useClass: ThingsFilterService},
  {provide: 'CountriesFilterService', useClass: CountriesFilterService},
  {provide: 'HomeHeaderService', useClass: HomeHeaderService},
  {provide: 'HomeMediaService', useClass: HomeMediaService},
  {provide: 'HomeMediaViewBlockService', useClass: HomeMediaViewBlockService},
  {provide: 'Angulartics2GoogleAnalytics', useClass: Angulartics2GoogleAnalytics},
  {provide: 'Math', useClass: MathService},
  {provide: 'Routes', useValue: Config.routes},
  {provide: 'DefaultArticleComponent', useValue: BlogComponent},
  {provide: PLATFORM_DIRECTIVES, useValue: ContentfulImageDirective, multi: true},
  {provide: PLATFORM_DIRECTIVES, useValue: Angulartics2On, multi: true},
  {provide: 'ContentfulTypeIds', useValue: ContentfulConfig},
  {provide: 'Constants', useValue: Constants},
  {provide: APP_BASE_HREF, useValue: '/'}
]).then(
  (appRef: ComponentRef<any>) => {
    appInjector(appRef.injector);
  }
);
