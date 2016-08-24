import { PhotographersComponent } from './photographers/photographers.component';
import { TeamComponent } from './team/team.component';
import { ArticleComponent } from './article/article.component';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MapComponent } from './map/map.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PhotographerComponent } from './photographer/photographer.component';
import { RouterConfig } from '@angular/router';
import { RoutesGatewayComponent, RoutesGatewayGuard, TagComponent } from 'ng2-contentful-blog';

let device = require('device.js')();
let isDesktop = device.desktop();

export interface ImageResolutionInterface {
  image: string;
  expand: string;
  full: string;
}

export class Config {
  // public static api: string = 'https://apidev.dollarstreet.org';
  // public static api:string = 'http://stage.dollarstreet.org';
  public static api: string = 'http://192.168.1.148';
  // public static api:string = 'http://192.168.1.57';
  // public static api:string = 'http://192.168.1.147';

  public static routes: RouterConfig = [
    {path: '', pathMatch: 'full', redirectTo: 'matrix'},
    {path: 'matrix', component: MatrixComponent, terminal: true},
    {path: 'family', component: HomeComponent},
    {path: 'map', component: MapComponent},
    {path: 'photographers', component: PhotographersComponent},
    {path: 'photographer/:id', component: PhotographerComponent},
    {path: 'team', component: TeamComponent},
    {path: 'country/:id', component: CountryComponent},
    {path: 'about', component: AboutComponent},
    {path: 'article/:id', component: ArticleComponent},
    {path: 'tag/:tag', component: TagComponent},
    {path: '**', component: RoutesGatewayComponent, canActivate: [RoutesGatewayGuard]}
  ];

  public static getCoordinates(querySelector: string, cb: any): any {
    let box: any = document.querySelector(querySelector).getBoundingClientRect();

    let body: HTMLElement = document.body;
    let docEl: HTMLElement = document.documentElement;

    let scrollLeft: number = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientLeft: number = docEl.clientLeft || body.clientLeft || 0;

    let top: number = box.top;
    let left: number = box.left + scrollLeft - clientLeft;

    cb({top: Math.round(top), left: Math.round(left), width: box.width, height: box.height});
  }

  public static getImageResolution(): ImageResolutionInterface {
    if (isDesktop) {
      return {
        image: 'devices',
        expand: 'desktops',
        full: 'original'
      };
    }

    if (window.innerWidth < 400) {
      return {
        image: '150x150',
        expand: 'devices',
        full: 'tablets'
      };
    }

    return {
      image: 'thumb',
      expand: 'tablets',
      full: 'desktops'
    };
  }
}
