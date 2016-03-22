import {Component, Inject} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {config} from './app.config';

import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

@Component({
  selector: 'consumer-app',
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})

@RouteConfig(config.routes)

export class AppComponent {
  type:string = 'app component';
  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;

  constructor(@Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }
}
