import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Angulartics2} from 'angulartics2/index';

import {AppComponent} from './app.component';
import {StreetDrawService} from './common/street/street.service';
import {MatrixService} from './matrix/matrix.service';
import {HeaderService} from './common/header/header.service';
import {SearchService} from './common/search/search.service';
import {CountryInfoService} from './country/country-info/country-info.service';
import {CountryPlacesService} from './country/country-places/country-places.service';
import {MainPlacesService} from './main/places/main.places.service.ts';
import {ThingsMainService} from './main/things/things.main.service';
import {PlaceStreetService} from './place/place-street.service.ts';
import {FamilyPlaceService} from './place/family/family-place.service';
import {ConceptMainService} from './main/concept/concept.main.service';
import {MapService} from './map/map.service';
import {UrlChangeService} from './common/url-change/url-change.service';
import {PhotographersService} from './all-photographers/photographers/photographers.service';
import {PhotographerProfileService} from './photographer/photographer-profile/photographer-profile.service';
import {PhotographerPlacesService} from './photographer/photographer-places/photographer-places.service';
import {AmbassadorsListService} from './ambassadors/ambassadors-list/ambassadors-list.service';
import {SocialShareButtonsService} from './common/social_share_buttons/social-share-buttons.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';
bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  Angulartics2,
  Angulartics2GoogleAnalytics,
  provide('StreetDrawService', {useClass: StreetDrawService}),
  provide('ConceptMainService', {useClass: ConceptMainService}),
  provide('ThingsMainService', {useClass: ThingsMainService}),
  provide('MatrixService', {useClass: MatrixService}),
  provide('HeaderService', {useClass: HeaderService}),
  provide('SearchService', {useClass: SearchService}),
  provide('MainPlacesService', {useClass: MainPlacesService}),
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
  provide(APP_BASE_HREF, {useValue: '/'})
]);

