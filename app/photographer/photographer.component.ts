import { Component, OnInit, Inject } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { PhotographerProfileComponent } from './photographer-profile/photographer-profile.component';
import { PhotographerPlacesComponent } from './photographer-places/photographer-places.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent, PhotographerProfileComponent, PhotographerPlacesComponent, FooterComponent, FooterSpaceDirective]
})

export class PhotographerComponent implements OnInit {
  private routeParams:RouteParams;
  private photographerId:string;

  public constructor(@Inject(RouteParams) routeParams:RouteParams) {
    this.routeParams = routeParams;
  }

  public ngOnInit():void {
    this.photographerId = this.routeParams.get('id');
  }
}
