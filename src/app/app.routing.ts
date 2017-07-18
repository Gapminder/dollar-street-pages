import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatrixComponent } from '../matrix/matrix.component';

const appRoutes: Routes = [
  {path: 'matrix', component: MatrixComponent},
  {path: 'family', loadChildren: '../family/family.module#FamilyModule'},
  {path: 'map', loadChildren: '../map/map.module#MapModule'},
  {path: 'photographers', loadChildren: '../photographers/photographers.module#PhotographersModule'},
  {path: 'photographer/:id', loadChildren: '../photographer/photographer.module#PhotographerModule'},
  {path: 'team', loadChildren: '../team/team.module#TeamModule'},
  {path: 'country/:id', loadChildren: '../country/country.module#CountryModule'},
  {path: 'about', loadChildren: '../about/about.module#AboutModule'},
  {path: 'article/:id', loadChildren: '../article/article.module#ArticleModule'},
  {path: 'donate', loadChildren: '../donate/donate.module#DonateModule'},
  {path: '**', redirectTo: 'matrix'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
