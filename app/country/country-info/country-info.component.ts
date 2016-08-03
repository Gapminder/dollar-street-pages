import { Component, OnInit, OnDestroy, Input, Inject, EventEmitter, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Rx';

let tpl = require('./country-info.template.html');
let style = require('./country-info.css');

@Component({
  selector: 'country-info',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, PlaceMapComponent]
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  protected math:any;
  @Input()
  private countryId:string;
  private isShowInfo:boolean;
  private country:any;
  private countryInfoService:any;
  private thing:any;
  private countryInfoServiceSubscribe:Subscriber;
  private placesQantity:any;
  private photosQantity:any;
  private videosQantity:any;
  private hoverPlace:Subject<any> = new Subject();
  @Output()
  private getCountry:EventEmitter<any> = new EventEmitter<any>();

  public constructor(@Inject('CountryInfoService') countryInfoService:any, @Inject('Math') math:any) {
    this.countryInfoService = countryInfoService;
    this.math = math;
    this.isShowInfo = false;
  }

  public ngOnInit():void {
    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.getCountry.emit(this.country.alias || this.country.country);
        this.hoverPlace.next(res.data.country);
        this.thing = res.data.thing;
        this.placesQantity = res.data.places;
        this.photosQantity = res.data.images;
        this.videosQantity = res.data.video;
      });
  }

  public ngOnDestroy():void {
    this.countryInfoServiceSubscribe.unsubscribe();
  }
}
