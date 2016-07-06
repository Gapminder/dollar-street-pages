import {Component, Inject} from '@angular/core';
import {RouteConfig, Router, RouterOutlet} from '@angular/router-deprecated';
import {Config} from './app.config';

@Component({
  selector: 'consumer-app',
  template: '<router-outlet></router-outlet>',
  directives: [RouterOutlet]
})

@RouteConfig(Config.routes)

export class AppComponent {
  private type:string;

  public constructor(@Inject(Router) router:Router) {
    router.subscribe(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });

    this.type = 'app component';
  }
}
