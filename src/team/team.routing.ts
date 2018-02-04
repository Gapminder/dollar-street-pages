import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamComponent } from './team.component';

const routes: Routes = [
  { path: '', component: TeamComponent }
];

export const TeamRouting: ModuleWithProviders = RouterModule.forChild(routes);
