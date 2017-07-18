import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryComponent } from './country.component';

const routes: Routes = [
  { path: '', component: CountryComponent }
];

export const CountryRouting: ModuleWithProviders = RouterModule.forChild(routes);
