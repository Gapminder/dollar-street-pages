import {Component, OnInit, OnDestroy, Input, Inject} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {LoaderComponent} from '../../common/loader/loader.component';

let tpl = require('./country-places.template.html');
let style = require('./country-places.css');

@Component({
  selector: 'country-places',
  template: tpl,
  styles: [style],
  directives: [RouterLink, LoaderComponent]
})

export class CountryPlacesComponent implements OnInit, OnDestroy {
  @Input()
  private countryId:string;

  private places:any = [];
  private country:any;
  private countryPlacesService:any;
  public loader:boolean = false;
  public countryPlacesServiceSubscribe:any;
  public math:any;

  constructor(@Inject('CountryPlacesService') countryPlacesService,
              @Inject('Math') math) {
    this.countryPlacesService = countryPlacesService;
    this.math = math;
  }

  ngOnInit():void {
    this.countryPlacesServiceSubscribe = this.countryPlacesService.getCountryPlaces(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.country = res.data.country;
        this.places = res.data.places;
        this.loader = true;
      });
  }

  ngOnDestroy() {
    this.countryPlacesServiceSubscribe.unsubscribe();
  }
}
