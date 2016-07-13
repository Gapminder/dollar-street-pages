import { Component, OnInit, Inject } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HeaderWithoutSearchComponent } from '../common/headerWithoutSearch/header.component';
import { CountryInfoComponent } from './country-info/country-info.component';
import { CountryPlacesComponent } from './country-places/country-places.component.ts';
import { FooterComponent } from '../common/footer/footer.component';

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
  protected title:string;
  private routeParams:RouteParams;
  private countryId:string;

  public constructor(@Inject(RouteParams) routeParams:RouteParams) {
    this.routeParams = routeParams;
  }

  public ngOnInit():void {
    this.countryId = this.routeParams.get('id');
  }
}
