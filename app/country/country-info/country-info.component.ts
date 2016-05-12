import {Component, OnInit, OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {PlaceMapComponent} from '../../common/place-map/place-map.component';
import {Subject} from 'rxjs/Subject';

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
  private isShowInfo:boolean = false;
  private country:any;
  private countryInfoService:any;
  private places:any;
  private thing:any;
  private countryInfoServiceSubscribe:any;
  private placesQantity:any;
  private photosQantity:any;
  private videosQantity:any;
  private hoverPlace:Subject<any> = new Subject();

  constructor(@Inject('CountryInfoService') countryInfoService) {
    this.countryInfoService = countryInfoService;
  }

  ngOnInit():void {
    this.countryInfoServiceSubscribe = this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.country = res.data.country;
        this.hoverPlace.next(res.data.country);
        this.thing = res.data.thing;
        this.placesQantity = res.data.places;
        this.photosQantity = res.data.images;
        this.videosQantity = res.data.video;
      });
  }

  ngOnDestroy():void {
    this.countryInfoServiceSubscribe.unsubscribe();
  }
}
