import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateComponent } from './donate.component';

const routes: Routes = [
  { path: '', component: DonateComponent }
];

export const DonateRouting: ModuleWithProviders = RouterModule.forChild(routes);
