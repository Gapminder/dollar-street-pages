import { Component, OnInit, OnDestroy, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { RegionMapComponent } from '../../common/region-map/region-map.component';
import { Subscriber } from 'rxjs/Rx';

let tpl = require('./country-info.template.html');
let style = require('./country-info.css');

@Component({
  selector: 'country-info',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, RegionMapComponent]
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  protected math: any;
  protected mapData: any;
  protected isShowInfo: boolean;
  protected country: any;
  protected thing: any;
  protected placesQuantity: any;
  protected photosQuantity: any;
  protected videosQuantity: any;

  @Input()
  private countryId: string;
  private countryInfoService: any;
  private countryInfoServiceSubscribe: Subscriber<any>;

  @Output()
  private getCountry: EventEmitter<any> = new EventEmitter<any>();

  public constructor(@Inject('CountryInfoService') countryInfoService: any, @Inject('Math') math: any) {
    this.countryInfoService = countryInfoService;
    this.math = math;
    this.isShowInfo = false;
  }

  public ngOnInit(): void {
    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.mapData = res.data.country;
        this.thing = res.data.thing;
        this.placesQuantity = res.data.places;
        this.photosQuantity = res.data.images;
        this.videosQuantity = res.data.video;
        this.getCountry.emit(this.country.alias || this.country.country);
      });
  }

  public ngOnDestroy(): void {
    this.countryInfoServiceSubscribe.unsubscribe();
  }
}
