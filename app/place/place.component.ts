import {Component, Inject, OnInit} from 'angular2/core';
import {
  Location,
  RouteParams
} from 'angular2/router';

import {FooterComponent} from '../common/footer/footer.component';
import {StreetComponent} from '../common/street/street.component';
import {HeaderComponent} from '../common/header/header.component';
import {SliderPlaceComponent} from './slider/slider.place.component';
import {PlaceStreetService} from './place.street.service';


import {FamilyPlaceComponent} from './family/family.place.component';

import {Subject} from "rxjs/Subject";

let tpl = require('./place.component.html');
let style = require('./place.component.css');


@Component({
  selector: 'place',
  template: tpl,
  styles: [style],
  directives: [HeaderComponent, StreetComponent, SliderPlaceComponent, FamilyPlaceComponent, FooterComponent]
})

export class PlaceComponent implements OnInit {
  private streetPlaces:Subject<any> = new Subject();
  private chosenPlaces:Subject<any> = new Subject();
  private controllSlider:Subject<any> = new Subject();
  private thing:string;
  private query:string;
  private image:string;
  private placeId:string;
  private place:any;

  constructor(@Inject(PlaceStreetService)
              private placeStreetService,
              @Inject(Location)
              private location,
              @Inject(RouteParams)
              private routeParams) {
  }

  ngOnInit() {
    this.thing = this.routeParams.get('thing');
    this.placeId = this.routeParams.get('place');
    this.image = this.routeParams.get('image');
    this.query = `thing=${this.thing}&place=${this.placeId}&image=${this.image}`;
    this.getStreetPlaces(this.query)
  }

  urlChanged(thing):void {
   // console.log(query)
  }

  getStreetPlaces(thing) {
    //getThingsByRegion
    this.placeStreetService.getThingsByRegion(thing).subscribe((res) =>{
      this.streetPlaces.next(res.data.places);
    })
  }

  choseCurrentPlace(place) {
    this.chosenPlaces.next(place);
    this.changeLocation(place[0], this.thing);
  }

  changeLocation(place, thing) {
    let query = `thing=${thing}&place=${place._id}&image=${place.image}`;
    this.location.replaceState(`/place`, `${query}`);
  }
}

