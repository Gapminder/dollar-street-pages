import { Component, OnInit, OnDestroy, Input, Inject, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { PlaceMapComponent } from '../../common/place-map/place-map.component';
import { Subject } from 'rxjs/Subject';

let tpl = require('./country-info.template.html');
let style = require('./country-info.css');

@Component({
  selector: 'country-info',
  template: tpl,
  styles: [style],
  directives: [RouterLink, PlaceMapComponent]
})

export class CountryInfoComponent implements OnInit, OnDestroy {
  @Input()
  private countryId:string;
  private isShowInfo:boolean;
  private country:any;
  private countryInfoService:any;
  private thing:any;
  private countryInfoServiceSubscribe:any;
  private placesQantity:any;
  private photosQantity:any;
  private videosQantity:any;
  private hoverPlace:Subject<any> = new Subject();
  @Output()
  private getCountry:EventEmitter<any> = new EventEmitter<any>();

  public constructor(@Inject('CountryInfoService') countryInfoService:any) {
    this.countryInfoService = countryInfoService;
    this.isShowInfo = false;
  }

  public ngOnInit():void {
    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.country = res.data.country;
        let country = this.country.alias || this.country.country;
        this.getCountry.emit(country);
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
