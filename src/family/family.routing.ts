import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyComponent } from './family.component';

const routes: Routes = [
  { path: '', component: FamilyComponent }
];

export const FamilyRouting: ModuleWithProviders = RouterModule.forChild(routes);
