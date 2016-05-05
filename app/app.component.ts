import {Component, Inject} from '@angular/core';
import {RouteConfig, Router, RouterOutlet} from '@angular/router-deprecated';
import {config} from './app.config';

@Component({
  selector: 'consumer-app',
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})

@RouteConfig(config.routes)

export class AppComponent {
  private router:Router;
  type:string = 'app component';

  constructor(@Inject(Router) router) {
    router.subscribe(() => {
      document.body.scrollTop = 0;
    });
  }
}
