import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PhotographersComponent } from './photographers/photographers.component';
import { TeamComponent } from './team/team.component';
import { ArticleComponent } from './article/article.component';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MapComponent } from './map/map.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PhotographerComponent } from './photographer/photographer.component';
import { TagComponent, RoutesGatewayGuard, RoutesGatewayComponent } from 'ng2-contentful-blog';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'matrix'},
  {path: 'matrix', component: MatrixComponent},
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

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
