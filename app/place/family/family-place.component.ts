import {Component, OnInit, OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {RowLoaderComponent} from '../../common/row-loader/row-loader.component';

let tpl = require('./family-place.template.html');
let style = require('./family-place.css');

const device = require('device.js')();
const isDesktop = device.desktop();

@Component({
  selector: 'family-place',
  template: tpl,
  styles: [style],
  directives: [RouterLink, RowLoaderComponent]
})

export class FamilyPlaceComponent implements OnInit, OnDestroy {
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;

  private familyPlaceService:any;
  private images:any = [];
  private placeId:string;
  private familyPlaceServiceSubscribe:any;
  private chosenPlacesSubscribe:any;
  private zoom:number = isDesktop ? 5 : 3;
  private itemSize:number = window.innerWidth / this.zoom;

  constructor(@Inject('FamilyPlaceService') familyPlaceService) {
    this.familyPlaceService = familyPlaceService;
  }

  ngOnInit():void {
    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((place) => {
        this.placeId = place[0]._id;
        this.nextImages(10, this.placeId);
      });
  }

  ngOnDestroy():void {
    this.familyPlaceServiceSubscribe.unsubscribe();
    this.chosenPlacesSubscribe.unsubscribe();
  }

  nextImages(limit:number, placeId:string):void {
    let url = `isTrash=false&limit=${limit}&placeId=${placeId}&skip=0`;
    this.familyPlaceServiceSubscribe = this.familyPlaceService.getPlaceFamilyImages(url)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.images = res.images;
      });
  }
}
