import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { config } from './app.config';

@Component({
  selector: 'consumer-app',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
  body {
  color: #374551;
}

a {
  -webkit-transition: all .2s ease-out;
  -moz-transition: all .2s ease-out;
  -o-transition: all .2s ease-out;
  transition: all .2s ease-out;
  text-decoration: none !important;
}

a:hover {
  cursor: pointer;
}
`],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS
  ]
})


@RouteConfig(config.routes)

export class AppComponent {
  type:string = 'app component';

  constructor() {
  }
}
