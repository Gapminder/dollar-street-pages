import { Component, OnInit , Inject } from 'angular2/core';

import {FamilyPlaceService} from './family.place.service';

let tpl = require('./family.place.component.html');
let style = require('./family.place.component.css');

@Component({
  selector: 'family-place',
  template: tpl,
  styles: [style],
  providers: [FamilyPlaceService]
})

export class FamilyPlaceComponent {
  public familyPlaceService:FamilyPlaceService;
  public loadMore:boolean = true;
  public amazon:any = '';
  public loadPage:boolean = true;
  public filterList:any = 'all';
  public type:any = {};
  public images:any = [];
  public places:any = [];
  public isZoom:boolean = false;

  constructor(@Inject(FamilyPlaceService) familyPlaceService:any) {
    this.familyPlaceService = familyPlaceService;
  }

  ngOnInit(): void {
    this.nextImages(10);
  }

  nextImages () {

    this.familyPlaceService.getPlaceFamilyImages('isTrash=false&limit=10&placeId=54b4f73c9f0c8d666e1ac45e&skip=0')
      .subscribe((res:any)=> {
        if (res.err) {
          return res.err;
        }
        this.images = res.images;
      });
  }
}
