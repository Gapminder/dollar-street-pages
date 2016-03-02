import {Component, OnInit, Input, Inject} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {FamilyPlaceService} from './family.place.service';

let tpl = require('./family.place.component.html');
let style = require('./family.place.component.css');

@Component({
  selector: 'family-place',
  template: tpl,
  styles: [style],
  providers: [FamilyPlaceService],
  directives: [RouterLink]
})

export class FamilyPlaceComponent implements OnInit {
  @Input('chosenPlaces')
  private chosenPlaces:Observable<any>;

  private familyPlaceService:FamilyPlaceService;
  private images:any = [];
  private placeId:string;

  constructor(@Inject(FamilyPlaceService) familyPlaceService:any) {
    this.familyPlaceService = familyPlaceService;
  }

  ngOnInit():void {
    this.chosenPlaces && this.chosenPlaces.subscribe((place) => {
      this.placeId = place[0]._id;
      this.nextImages(10, this.placeId);
    })
  }

  nextImages(limit:number, placeId:string):void {
    let url = `isTrash=false&limit=${limit}&placeId=${placeId}&skip=0`;
    this.familyPlaceService.getPlaceFamilyImages(url)
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.images = res.images;
      });
  }
}
