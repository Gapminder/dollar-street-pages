import {Component, OnInit, Inject} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {HeaderPhotographerComponent} from './header/photographer-header.component';
import {PhotographerProfileComponent} from './photographer-profile/photographer-profile.component';
import {PhotographerPlacesComponent} from './photographer-places/photographer-places.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [HeaderPhotographerComponent, PhotographerProfileComponent, PhotographerPlacesComponent, FooterComponent]
})

export class PhotographerComponent implements OnInit {
  private routeParams:RouteParams;
  private photographerName:string;

  constructor(@Inject(RouteParams) routeParams) {
    this.routeParams = routeParams;
  }

  ngOnInit() {
    this.photographerName = decodeURI(this.routeParams.get('name'));
  }
}
