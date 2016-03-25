import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Angulartics2} from 'angulartics2/index';

import {AppComponent} from './app.component';
import {MatrixService} from './matrix/matrix.service';
import {HeaderService} from './common/header/header.service';
import {SearchService} from './common/search/search.service';
import {CountryInfoService} from './country/country-info/country-info.service';
import {CountryPlacesService} from './country/country-places/country-places.service';
import {MainPlacesService} from './main/places/main.places.service.ts';
import {ThingsMainService} from './main/things/things.main.service';
import {PlaceStreetService} from './place/place-street.service.ts';
import {ConceptMainService} from './main/concept/concept.main.service';
import {MapService} from './map/map.service';
import {UrlChangeService} from './common/url-change/url-change.service';
import {PhotographersService} from './all-photographers/photographers/photographers.service';
import {PhotographerProfileService} from './photographer/photographer-profile/photographer-profile.service';
import {PhotographerPlacesService} from './photographer/photographer-places/photographer-places.service';
import {AmbassadorsListService} from './ambassadors/ambassadors-list/ambassadors-list.service';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  Angulartics2,
  ConceptMainService,
  ThingsMainService,
  MatrixService,
  HeaderService,
  SearchService,
  MainPlacesService,
  PlaceStreetService,
  MapService,
  UrlChangeService,
  PhotographersService,
  PhotographerProfileService,
  PhotographerPlacesService,
  AmbassadorsListService,
  Angulartics2GoogleAnalytics,
  CountryInfoService,
  CountryPlacesService,
  provide(APP_BASE_HREF, {useValue: '/'})
]);

