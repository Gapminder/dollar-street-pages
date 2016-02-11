import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { config } from './app.config';

@Component({
  selector: 'consumer-app',
  template: `
  <h1>Here will be new consumer app</h1>
    <nav>
      <a [routerLink]="['Main']">Main</a>
      <a [routerLink]="['Matrix']">Matrix</a>
      <a [routerLink]="['Place']">Place</a>
    </nav>
    <router-outlet></router-outlet>
  `,
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
