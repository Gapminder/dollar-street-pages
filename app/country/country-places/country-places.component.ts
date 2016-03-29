import {Component, OnInit,OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Angulartics2On} from 'angulartics2/index';

import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./country-places.template.html');
let style = require('./country-places.css');

@Component({
  selector: 'country-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On, LoaderComponent]
})

export class CountryPlacesComponent implements OnInit,OnDestroy {
  @Input()
  private countryId:string;

  private places:any = [];
  private country:any;
  private countryPlacesService:any;
  public loader:boolean = false;
  public countryPlacesServiceSubscribe:any;

  constructor(@Inject('CountryPlacesService') countryPlacesService) {
    this.countryPlacesService = countryPlacesService;
  }

  ngOnInit():void {
    this.countryPlacesServiceSubscribe=this.countryPlacesService.getCountryPlaces(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.country = res.data.country;
        this.places = res.data.places;
        console.log(this.places)
        this.loader = true;
      });
  }
  ngOnDestroy(){
    this.countryPlacesServiceSubscribe.unsubscribe();
  }
}
