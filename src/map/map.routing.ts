import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';

const routes: Routes = [
  { path: '', component: MapComponent }
];

export const MapRouting: ModuleWithProviders = RouterModule.forChild(routes);
