import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotographerComponent } from './photographer.component';

const routes: Routes = [
  { path: '', component: PhotographerComponent }
];

export const PhotographerRouting: ModuleWithProviders = RouterModule.forChild(routes);
