import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotographersComponent } from './photographers.component';

const routes: Routes = [
  { path: '', component: PhotographersComponent }
];

export const PhotographersRouting: ModuleWithProviders = RouterModule.forChild(routes);
