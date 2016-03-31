import {Component, Inject} from 'angular2/core';
import {RouteConfig, Router, RouterOutlet} from 'angular2/router';
import {config} from './app.config';

import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

@Component({
  selector: 'consumer-app',
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})

@RouteConfig(config.routes)

export class AppComponent {
  private router:Router;
  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;
  type:string = 'app component';

  constructor(@Inject(Router) router,
              @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;

    router.subscribe(() => {
      document.body.scrollTop = 0;
    });
  }
}
