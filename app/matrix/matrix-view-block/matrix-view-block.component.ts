import {Component, Input, Output, OnChanges, Inject, EventEmitter, NgZone} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {RouterLink, Router} from '@angular/router-deprecated';

import {PlaceMapComponent} from '../../common/place-map/place-map.component';
import {StreetMiniComponent} from '../../common/street-mini/street-mini.component';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: tpl,
  styles: [style],
  directives: [PlaceMapComponent, StreetMiniComponent, RouterLink]
})

export class MatrixViewBlockComponent implements OnChanges {
  public familyInfoServiceSubscribe:any;
  public fancyBoxImage:any;

  protected imageUrl:string;
  protected country:any;
  protected familyName:string;
  protected familyInfoSum:string;
  protected homesInCountry:number;
  protected relatedThings:any = [];
  protected photographer:string;
  protected photographerId:any;
  protected showblock:boolean;
  protected countryId:any;
  protected thingName:any;
  protected placesPerCountry:number;
  protected placesPerRegion:number;

  private popIsOpen:boolean;
  private mapData:ReplaySubject<any> = new ReplaySubject(0);
  private streetMiniData:ReplaySubject<any> = new ReplaySubject(0);
  private FamilyInfoService:any;
  private router:Router;
  private isDesktop:boolean = isDesktop;
  private paramsUrl:any;
  private matrixComponent:boolean;
  private zone:NgZone;

  @Input('zoom')
  private zoom:any;
  @Input('place')
  private place:any;
  @Input('thing')
  private thing:string;
  @Output('thingsByIncomes')
  private thingsByIncomes:EventEmitter<any> = new EventEmitter();

  public constructor(@Inject('FamilyInfoService') FamilyInfoService:any,
                     @Inject(Router) router:Router,
                     @Inject(NgZone) zone:NgZone) {
    this.FamilyInfoService = FamilyInfoService;
    this.router = router;
    this.matrixComponent = this.router.hostComponent.name === 'MatrixComponent';
    this.zone = zone;
  }

  public ngOnChanges():void {
    this.showblock = true;
    let placeId = this.place._id;
    let imageId = this.place.image;
    let thingId = this.thing;
    let url = `placeId=${placeId}&imageId=${imageId}&thingId=${thingId}`;

    this.paramsUrl = {
      thing: this.thing,
      countries: this.place.country,
      regions: this.place.region
    };

    this.imageUrl = this.place.background.replace('devices', 'desktops');
    this.country = this.place.country;
    this.mapData.next({region: this.place.region, lat: this.place.lat, lng: this.place.lng});

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
      this.familyInfoServiceSubscribe = void 0;
    }

    this.familyInfoServiceSubscribe = this.FamilyInfoService.getFamilyInfo(url)
      .subscribe((res:any) => {
        let familyData = res.data;
        if (res.err) {
          return;
        }

        this.familyName = familyData.data.familyName;
        this.countryId = familyData.data.countryId;
        this.homesInCountry = familyData.data.familyCount;
        this.thingName = familyData.data.thingName.plural || familyData.data.thingName.thingName;
        this.familyInfoSum = familyData.data.familyData;
        this.relatedThings = familyData.data.images;
        this.photographer = familyData.data.photographer.name;
        this.photographerId = familyData.data.photographer.id;
        this.streetMiniData.next({place: this.place, incomes: familyData.data.income});
      });

    if (this.thing && this.place.country && this.zoom) {

      let urlCountry = `thing=${this.thing}&countries=${this.place.country}&regions=${'World'}&zoom=${this.zoom}&row=1&isViewBox=true`;
      let urlRegion = `thing=${this.thing}&countries=${'World'}&regions=${this.place.region}&zoom=${this.zoom}&row=1&isViewBox=true`;
      this.familyInfoServiceSubscribe = this.FamilyInfoService.getCountMatrixImages(urlCountry)
        .subscribe((val:any) => {
          if (val.err) {
            return;
          }
          this.placesPerCountry = val.data.zoomPlaces;
        });
      this.familyInfoServiceSubscribe = this.FamilyInfoService.getCountMatrixImages(urlRegion)
        .subscribe((val:any) => {
          if (val.err) {
            return;
          }
          this.placesPerRegion = val.data.zoomPlaces;
        });
    }
  }

  protected goToPlace(place:any):void {
    if (this.isDesktop) {
      this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);
      return;
    }
    this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);
  }

  protected closeBlock():void {
    this.showblock = false;
  }

  protected goToPhotoOnFamilyPage(thingId:any, place:any, imageId:any):void {
    this.router.navigate(['Place', {thing: thingId, place: place._id, image: imageId}]);
  }

  protected goToRelatedThingsIn(place:string):void {
    let countryDirector:string;
    let regionDirector:string;
    let url;
    // this.showblock = false;

    if (place === 'country') {
      countryDirector = this.place.country;
      regionDirector = 'World';
    }
    if (place === 'region') {
      countryDirector = 'World';
      regionDirector = this.place.region;
    }
    url = {url: `thing=${this.thing}&countries=${countryDirector}&regions=${regionDirector}&zoom=${this.zoom}&row=0&lowIncome=0&highIncome=15000`};
    this.thingsByIncomes.emit(url);
  }

  protected openPopUp():void {
    this.popIsOpen = true;
    let imgUrl = this.place.background.replace('devices', 'original');
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

  protected fancyBoxClose():void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }
}
