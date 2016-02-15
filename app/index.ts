import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './app.component';
import {MatrixService} from './matrix/matrix.service'

bootstrap(AppComponent,[
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  MatrixService,
  provide(APP_BASE_HREF, {useValue: '/'})
]);

