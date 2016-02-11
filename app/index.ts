import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, APP_BASE_HREF, HashLocationStrategy, LocationStrategy, } from 'angular2/router';

import {AppComponent} from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'}),
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);

