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
import {SliderMobilePlaceComponent} from './slider-mobile/slider-mobile.place.component';
import {FamilyPlaceComponent} from './family/family.place.component';

import {Subject} from "rxjs/Subject";

let tpl = require('./place.component.html');
let style = require('./place.component.css');

var device = require('device.js')();
var mobile = device.mobile();
var tablet = device.tablet();


@Component({
  selector: 'place',
  template: tpl,
  styles: [style],
  directives: [HeaderComponent, StreetComponent, (mobile || tablet) ? SliderMobilePlaceComponent : SliderPlaceComponent, FamilyPlaceComponent, FooterComponent]
})

export class PlaceComponent implements OnInit {
  private streetPlaces:Subject<any> = new Subject();
  private chosenPlaces:Subject<any> = new Subject();
  private controllSlider:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  private thing:string;
  private query:string;
  private image:string;
  private place:any;
  private init:boolean = true;

  constructor(@Inject(PlaceStreetService)
              private placeStreetService,
              @Inject(Location)
              private location,
              @Inject(RouteParams)
              private routeParams) {
  }

  ngOnInit() {
    this.thing = this.routeParams.get('thing');
    this.place = this.routeParams.get('place');
    this.image = this.routeParams.get('image');
    this.query = `thing=${this.thing}&place=${this.place}&image=${this.image}`;
    this.getStreetPlaces(this.query)
  }

  urlChanged(thing):void {
    if (this.init) {
      return;
    }
    this.getStreetPlaces(`thing=${thing._id}&place=${this.place}&isSearch=true`)
  }

  isHover() {
    this.hoverHeader.next(null)
  }

  getStreetPlaces(thing) {
    this.placeStreetService.getThingsByRegion(thing).subscribe((res) => {
      this.streetPlaces.next(res.data.places);
      this.init = false;
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
