import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HeaderWithoutFiltersComponent } from './header-without-filters/header.component';
import { RouterModule } from '@angular/router';
import { HeaderService } from './header/header.service';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderWithoutFiltersComponent
  ],
  imports: [
    HttpModule,
    RouterModule
  ],
  providers: [
    HeaderService
  ],
  exports: [HeaderWithoutFiltersComponent]
})
export class SharedModule {

}
