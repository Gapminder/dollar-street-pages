import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './app.component';
import {MatrixService} from './matrix/matrix.service';
import {SearchService} from './common/search/search.service';
import {MainPlacesService} from './main/places/main.places.service.ts';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  MatrixService,
  SearchService,
  MainPlacesService,
  provide(APP_BASE_HREF, {useValue: '/'})
]);

