import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PhotographersComponent } from './photographers';
import { TeamComponent } from './team';
import { ArticleComponent } from './article';
import { CountryComponent } from './country';
// import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { MapComponent } from './map';
import { MatrixComponent } from './matrix';
import { PhotographerComponent } from './photographer';

export const routes: Routes = [
  {path: 'matrix', component: MatrixComponent},
  // {path: 'family', component: HomeComponent},
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
