import { AllPhotographersComponent } from './all-photographers/all-photographers.component';
import { AmbassadorsComponent } from './ambassadors/ambassadors.component';
import { ArticleComponent } from './article/article.component';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { MapComponent } from './map/map.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PhotographerComponent } from './photographer/photographer.component';
import { RouterConfig } from '@angular/router';
import { RoutesGatewayComponent, RoutesGatewayGuard } from 'ng2-contentful-blog';

export class Config {
  // public static api:string = 'https://apidev.dollarstreet.org';
  // public static api:string = 'http://stage.dollarstreet.org';
  public static api: string = 'http://192.168.1.148';
  // public static api:string = 'http://192.168.1.57';
  // public static api:string = 'http://192.168.1.147';

  public static routes: RouterConfig = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'matrix'
  }, {
    path: 'matrix',
    component: MatrixComponent,
    terminal: true
  }, {
    path: 'family',
    component: HomeComponent
  }, {
    path: 'map',
    component: MapComponent
  }, {
    path: 'photographers',
    component: AllPhotographersComponent
  }, {
    path: 'photographer/:id',
    component: PhotographerComponent
  }, {
    path: 'ambassadors',
    component: AmbassadorsComponent
  }, {
    path: 'country/:id',
    component: CountryComponent
  }, {
    path: 'info',
    component: InfoComponent
  }, {
    path: 'article/:id',
    component: ArticleComponent
  }, {
    path: '**',
    component: RoutesGatewayComponent,
    canActivate: [RoutesGatewayGuard]
  }];
}
