import {provide} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {APP_BASE_HREF} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent} from './app.component';
import {StreetDrawService} from './common/street/street.service';
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
bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide('StreetDrawService', {useClass: StreetDrawService}),
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
  provide('Math', {useClass: MathService}),
  provide(APP_BASE_HREF, {useValue: '/'})
]);

