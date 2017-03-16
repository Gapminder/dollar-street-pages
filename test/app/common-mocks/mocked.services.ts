import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy, PlatformLocation, Location } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import { BrowserPlatformLocation } from '@angular/platform-browser';
import { Injector, ComponentResolver, PLATFORM_DIRECTIVES } from '@angular/core';
// import { ContentfulService } from 'ng2-contentful';
// import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { MathService } from '../../../src/common/math/math.service';
import { StreetDrawService } from '../../../src/shared/street/street.service';
// import { HomeIncomeFilterService } from '../../../src/shared/income-filter/income-filter.service';
// import { HomeHeaderService } from '../../../src/home/home-header/home-header.service';
// import { HomeMediaService } from '../../../src/home/home-media/home-media.service';
// import { HomeMediaViewBlockService } from '../../../src/home/home-media/home-media-view-block/home-media-view-block.service';
import { StreetSettingsService } from '../../../src/common/street/street.settings.service';
import { MatrixService } from '../../../src/matrix/matrix.service';
import { HeaderService } from '../../../src/shared/header/header.service';
import { CountryInfoService } from '../../../src/country/country-info/country-info.service';
import { CountryPlacesService } from '../../../src/country/country-places/country-places.service';
import { MapService } from '../../../src/map/map.service';
import { UrlChangeService } from '../../../src/common/url-change/url-change.service';
import { PhotographersService } from '../../../src/photographers/photographers.service';
import { PhotographerProfileService } from '../../../src/photographer/photographer-profile/photographer-profile.service';
import { PhotographerPlacesService } from '../../../src/photographer/photographer-places/photographer-places.service';
import { TeamService } from '../../../src/team/team.service';
import { SocialShareButtonsService } from '../../../src/shared/social-share-buttons/social-share-buttons.service';
import { AboutService } from '../../../src/about/about.service';
import { FooterService } from '../../../src/shared/footer/footer.service';
import { UrlSerializer, DefaultUrlSerializer, RouterOutletMap, Router, ActivatedRoute } from '@angular/router';
import { Config } from '../../../src/app.config';
import { AppComponent } from '../../../src/app/app.component';
import { StreetFilterDrawService } from '../../../src/shared/street-filter/street-filter.service';
import { StreetMobileDrawService } from '../../../src/shared/street-mobile/street-mobile.service';
import { GuideService } from '../../../src/shared/guide/guide.service';
import { ArticleService } from '../../../src/article/article.service';
import { FamilyInfoService } from '../../../src/matrix/matrix-view-block/matrix-view-block.service';
import { ThingsFilterService } from '../../../src/shared/things-filter/things-filter.service';
import { CountriesFilterService } from '../../../src/common/countries-filter/countries-filter.service';
import { TitleHeaderService } from '../../../src/common/title-header/title-header.service';
import { LoaderService } from '../../../src/common/loader/loader.service';
import { Angulartics2, Angulartics2On } from 'angulartics2';
// import { GAPMINDER_PROVIDERS, ContentfulImageDirective } from 'ng2-contentful-blog';
// import { BlogComponent } from '../../../src/blog/blog.component';
import { SpyLocation } from '@angular/common/testing/location_mock';

/*window.ga = () => {
  return;
};*/

export class MockCommonDependency {
  public getProviders(): Array<any> {
    return [
      Angulartics2,
      HTTP_PROVIDERS,
      RouterOutletMap,
      // GAPMINDER_PROVIDERS,
      {provide: UrlSerializer, useClass: DefaultUrlSerializer},
      {provide: Location, useClass: SpyLocation},
      {provide: LocationStrategy, useClass: HashLocationStrategy},
      {provide: PlatformLocation, useClass: BrowserPlatformLocation},
      {
        provide: Router,
        useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer,
                     outletMap: RouterOutletMap, location: Location,
                     injector: Injector) => {
          return new Router(
            AppComponent, resolver, urlSerializer, outletMap,
            location, injector, Config.routes);
        },
        deps: [
          ComponentResolver,
          UrlSerializer,
          RouterOutletMap,
          Location,
          Injector
        ]
      },
      {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]},
      {provide: 'StreetDrawService', useClass: StreetDrawService},
      {provide: 'StreetFilterDrawService', useClass: StreetFilterDrawService},
      {provide: 'StreetMobileDrawService', useClass: StreetMobileDrawService},
      {provide: 'MatrixService', useClass: MatrixService},
      {provide: 'HeaderService', useClass: HeaderService},
      {provide: 'StreetSettingsService', useClass: StreetSettingsService},
      // {provide: 'HomeIncomeFilterService', useClass: HomeIncomeFilterService},
      {provide: 'FooterService', useClass: FooterService},
      {provide: 'GuideService', useClass: GuideService},
      {provide: 'MapService', useClass: MapService},
      {provide: 'UrlChangeService', useClass: UrlChangeService},
      {provide: 'PhotographerProfileService', useClass: PhotographerProfileService},
      {provide: 'PhotographerPlacesService', useClass: PhotographerPlacesService},
      {provide: 'TeamService', useClass: TeamService},
      {provide: 'CountryInfoService', useClass: CountryInfoService},
      {provide: 'CountryPlacesService', useClass: CountryPlacesService},
      {provide: 'PhotographersService', useClass: PhotographersService},
      {provide: 'SocialShareButtonsService', useClass: SocialShareButtonsService},
      {provide: 'AboutService', useClass: AboutService},
      {provide: 'ArticleService', useClass: ArticleService},
      // {provide: 'ContentfulService', useClass: ContentfulService},
      {provide: 'FamilyInfoService', useClass: FamilyInfoService},
      {provide: 'ThingsFilterService', useClass: ThingsFilterService},
      {provide: 'CountriesFilterService', useClass: CountriesFilterService},
      // {provide: 'HomeHeaderService', useClass: HomeHeaderService},
      // {provide: 'HomeMediaService', useClass: HomeMediaService},
      // {provide: 'HomeMediaViewBlockService', useClass: HomeMediaViewBlockService},
      {provide: 'Angulartics2GoogleAnalytics', useClass: Angulartics2GoogleAnalytics},
      {provide: 'TitleHeaderService', useClass: TitleHeaderService},
      {provide: 'LoaderService', useClass: LoaderService},
      {provide: 'Math', useClass: MathService},
      // {provide: 'DefaultArticleComponent', useValue: BlogComponent},
      // {provide: PLATFORM_DIRECTIVES, useValue: ContentfulImageDirective, multi: true},
      {provide: PLATFORM_DIRECTIVES, useValue: Angulartics2On, multi: true},
      {provide: APP_BASE_HREF, useValue: '/'}
    ];
  }
}
