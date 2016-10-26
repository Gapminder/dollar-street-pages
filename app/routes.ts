import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PhotographersComponent } from './photographers/photographers.component';
import { TeamComponent } from './team/team.component';
import { ArticleComponent } from './article/article.component';
import { CountryComponent } from './country/country.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from '../src/about/about.component';
import { MapComponent } from './map/map.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PhotographerComponent } from './photographer/photographer.component';

export const routes: Routes = [
  {path: 'matrix', component: MatrixComponent},
  {path: 'family', component: HomeComponent},
  {path: 'map', component: MapComponent},
  {path: 'photographers', component: PhotographersComponent},
  {path: 'photographer/:id', component: PhotographerComponent},
  {path: 'team', component: TeamComponent},
  {path: 'country/:id', component: CountryComponent},
  {path: 'about', component: AboutComponent},
  {path: 'article/:id', component: ArticleComponent},
  {path: '**', redirectTo: 'matrix'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
