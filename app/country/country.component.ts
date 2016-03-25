import {Component, OnInit, Inject} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {HeaderWithoutSearchComponent} from '../common/headerWithoutSearch/header.component';
import {CountryInfoComponent} from './country-info/country-info.component';
import {CountryPlacesComponent} from './country-places/country-places.component.ts';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./country.template.html');
let style = require('./country.css');

@Component({
  selector: 'country',
  template: tpl,
  styles: [style],
  directives: [HeaderWithoutSearchComponent,
    CountryInfoComponent,
    CountryPlacesComponent, 
    FooterComponent]
})

export class CountryComponent implements OnInit {
  private title:string = 'Country';
  private routeParams:RouteParams;
  private countryId:string;

  constructor(@Inject(RouteParams) routeParams) {
    this.routeParams = routeParams;
  }

  ngOnInit() {
    this.countryId = this.routeParams.get('id');
  }
}
