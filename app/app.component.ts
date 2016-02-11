import {Component} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { MainComponent } from './main/main.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PlaceComponent } from './place/place.component';

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

@RouteConfig([
  {
    path: '/main',
    name: 'Main',
    component: MainComponent,
    useAsDefault: true
  },
  {
    path: '/matrix',
    name: 'Matrix',
    component: MatrixComponent
  },
  {
    path: '/place',
    name: 'Place',
    component: PlaceComponent
  }
])

export class AppComponent {
  type:string = 'app component';

  constructor() {
  }
}
