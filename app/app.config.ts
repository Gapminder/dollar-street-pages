import { MatrixComponent } from './matrix/matrix.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { AllPhotographersComponent } from './all-photographers/all-photographers.component';
import { PhotographerComponent } from './photographer/photographer.component';
import { AmbassadorsComponent } from './ambassadors/ambassadors.component';
import { CountryComponent } from './country/country.component';
import { InfoComponent } from './info/info.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './contentful/blog/blog.component';
import { PostComponent } from './contentful/post/post.component';

export class Config {
  // public static api:string = 'https://apidev.dollarstreet.org';
  // public static api:string = 'http://stage.dollarstreet.org';
  // public static api:string = 'http://128.199.60.70';
  // public static api:string = 'http://192.168.1.66';
  // public static api:string = 'http://192.168.1.145';
  // public static api:string = 'http://192.168.1.148';
  // public static api:string = 'http://192.168.1.57';
  // public static api:string = 'http://192.168.1.142';
  // public static api:string = 'http://192.168.0.102';
   public static api:string = 'http://192.168.1.147';

  public static routes:any = [{
    path: '/matrix',
    name: 'Matrix',
    component: MatrixComponent,
    useAsDefault: true
  }, {
    path: '/home',
    name: 'Home',
    component: HomeComponent
  }, {
    path: '/map',
    name: 'Map',
    component: MapComponent
  }, {
    path: '/photographers',
    name: 'Photographers',
    component: AllPhotographersComponent
  }, {
    path: '/photographer',
    name: 'Photographer',
    component: PhotographerComponent
  }, {
    path: '/ambassadors',
    name: 'Ambassadors',
    component: AmbassadorsComponent
  }, {
    path: '/country',
    name: 'Country',
    component: CountryComponent
  }, {
    path: '/info',
    name: 'Info',
    component: InfoComponent
  }, {
    path: '/article',
    name: 'Article',
    component: ArticleComponent
  }, {
    path: '/blog',
    name: 'Blog',
    component: BlogComponent
  }, {
    path: '/post',
    name: 'Post',
    component: PostComponent
  }];
}
