import {Component, OnInit,OnDestroy, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {FamilyPlaceService} from './family-place.service.ts';

let tpl = require('./family-place.template.html');
let style = require('./family-place.css');

@Component({
  selector: 'family-place',
  template: tpl,
  styles: [style],
  providers: [FamilyPlaceService],
  directives: [RouterLink]
})

export class FamilyPlaceComponent implements OnInit,OnDestroy {
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;

  private familyPlaceService:FamilyPlaceService;
  private images:any = [];
  private placeId:string;
  private familyPlaceServiceSubscribe:any;
  private chosenPlacesSubscribe:any;

  constructor(@Inject(FamilyPlaceService) familyPlaceService:any) {
    this.familyPlaceService = familyPlaceService;
  }

  ngOnInit():void {
    this.chosenPlacesSubscribe = this.chosenPlaces && this.chosenPlaces.subscribe((place) => {
        this.placeId = place[0]._id;
        this.nextImages(10, this.placeId);
      })
  }

  ngOnDestroy():void {
    this.familyPlaceServiceSubscribe.unsubscribe();
    this.chosenPlacesSubscribe.unsubscribe();
  }

  nextImages(limit:number, placeId:string):void {
    let url = `isTrash=false&limit=${limit}&placeId=${placeId}&skip=0`;
    this.familyPlaceServiceSubscribe = this.familyPlaceService.getPlaceFamilyImages(url)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.images = res.images;
      });
  }
}
