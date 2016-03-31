import {Component, OnInit,OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {PlaceMapComponent} from '../../common/place-map/place-map.component';

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

  private country:any = {};
  private countryInfoService:any;
  private places:any;
  private countryInfoServiceSubscribe:any;
  private placesQantity:any;
  private photosQantity:any;
  private videosQantity:any;

  constructor(@Inject('CountryInfoService') countryInfoService) {
    this.countryInfoService = countryInfoService;
  }

  ngOnInit():void {
    this.countryInfoServiceSubscribe=this.countryInfoService.getCountryInfo(`id=${this.countryId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }
        this.country = res.data.country;
        this.placesQantity = res.data.places;
        this.photosQantity = res.data.images;
      });
  }
  ngOnDestroy():void{
    this.countryInfoServiceSubscribe.unsubscribe()
  }


  isShowInfoMore(country:any):boolean {
    return country.description;
  }
}
