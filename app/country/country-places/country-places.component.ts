import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

let tpl = require('./country-places.template.html');
let style = require('./country-places.css');

@Component({
  selector: 'country-places',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES]
})

export class CountryPlacesComponent implements OnInit, OnDestroy {
  public countryPlacesServiceSubscribe: Subscription;
  public math: any;
  @Input()
  private countryId: string;
  private places: any = [];
  private country: any;
  private countryPlacesService: any;
  private loaderService: any;

  public constructor(@Inject('CountryPlacesService') countryPlacesService: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('Math') math: any) {
    this.countryPlacesService = countryPlacesService;
    this.math = math;
    this.loaderService = loaderService;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    this.countryPlacesServiceSubscribe = this.countryPlacesService.getCountryPlaces(`id=${this.countryId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.places = res.data.places;

        this.loaderService.setLoader(true);
      });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);
    this.countryPlacesServiceSubscribe.unsubscribe();
  }
}
