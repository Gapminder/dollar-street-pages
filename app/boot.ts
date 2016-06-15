import {provide} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {APP_BASE_HREF} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent} from './app.component';
import {StreetDrawService} from './common/street/street.service';
import {StreetMiniDrawService} from './common/street-mini/street-mini.service';
import {MathService} from './common/math-service/math-service';
import {MatrixService} from './matrix/matrix.service';
import {HeaderService} from './common/header/header.service';
import {SearchService} from './common/search/search.service';
import {CountryInfoService} from './country/country-info/country-info.service';
import {CountryPlacesService} from './country/country-places/country-places.service';
import {PlaceStreetService} from './place/place-street.service.ts';
import {FamilyPlaceService} from './place/family/family-place.service';
import {MapService} from './map/map.service';
import {UrlChangeService} from './common/url-change/url-change.service';
import {PhotographersService} from './all-photographers/photographers/photographers.service';
import {PhotographerProfileService} from './photographer/photographer-profile/photographer-profile.service';
import {PhotographerPlacesService} from './photographer/photographer-places/photographer-places.service';
import {AmbassadorsListService} from './ambassadors/ambassadors-list/ambassadors-list.service';
import {SocialShareButtonsService} from './common/social_share_buttons/social-share-buttons.service';
import {InfoContextService} from './info/info-context/info-context.service';
import {ArticleService} from './article/article.service';
import {FamilyInfoService} from './matrix/matrix-view-block/matrix-view-block.service';

import {ContenfulContent} from './contentful/contentful.service';
import {ContentfulService} from 'ng2-contentful/src/index';
import {Ng2ContentfulConfig} from 'ng2-contentful/src/index';

Ng2ContentfulConfig.config = {
  accessToken: '7e33820119e63f72f286be1f474e89be6eafc4af751b2e91b93f130abc5a20a1',
  space: 'we1a0j890sea',
  host: 'cdn.contentful.com'
};

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide('StreetDrawService', {useClass: StreetDrawService}),
  provide('StreetMiniDrawService', {useClass: StreetMiniDrawService}),
  provide('MatrixService', {useClass: MatrixService}),
  provide('HeaderService', {useClass: HeaderService}),
  provide('SearchService', {useClass: SearchService}),
  provide('PlaceStreetService', {useClass: PlaceStreetService}),
  provide('FamilyPlaceService', {useClass: FamilyPlaceService}),
  provide('MapService', {useClass: MapService}),
  provide('UrlChangeService', {useClass: UrlChangeService}),
  provide('PhotographerProfileService', {useClass: PhotographerProfileService}),
  provide('PhotographerPlacesService', {useClass: PhotographerPlacesService}),
  provide('AmbassadorsListService', {useClass: AmbassadorsListService}),
  provide('CountryInfoService', {useClass: CountryInfoService}),
  provide('CountryPlacesService', {useClass: CountryPlacesService}),
  provide('PhotographersService', {useClass: PhotographersService}),
  provide('SocialShareButtonsService', {useClass: SocialShareButtonsService}),
  provide('InfoContextService', {useClass: InfoContextService}),
  provide('ArticleService', {useClass: ArticleService}),
  provide('ContenfulContent', {useClass: ContenfulContent}),
  provide('ContentfulService', {useClass: ContentfulService}),
  provide('FamilyInfoService', {useClass: FamilyInfoService}),
  provide('Math', {useClass: MathService}),
  provide(APP_BASE_HREF, {useValue: '/'})
]);

