import {Component, Inject, OnInit,OnDestroy} from 'angular2/core';
import {RouteParams, RouterLink} from 'angular2/router';
import {Subject} from "rxjs/Subject";

import {FooterComponent} from '../common/footer/footer.component';
import {StreetComponent} from '../common/street/street.component';
import {HeaderComponent} from '../common/header/header.component';
import {UrlChangeService} from '../common/url-change/url-change.service';
import {SliderPlaceComponent} from './slider/slider.place.component';
import {PlaceStreetService} from './place.street.service';
import {SliderMobilePlaceComponent} from './slider-mobile/slider-mobile.place.component';
import {FamilyPlaceComponent} from './family/family.place.component';
import {LoaderComponent} from '../common/loader/loader.component';

let tpl = require('./place.component.html');
let style = require('./place.component.css');

let device = require('device.js')();
let isDesktop = device.desktop();

@Component({
  selector: 'place',
  template: tpl,
  styles: [style],
  directives: [RouterLink, HeaderComponent, StreetComponent, isDesktop ? SliderPlaceComponent : SliderMobilePlaceComponent, FamilyPlaceComponent, FooterComponent, LoaderComponent]
})

export class PlaceComponent implements OnInit,OnDestroy {
  private streetPlaces:Subject<any> = new Subject();
  private sliderPlaces:Subject<any> = new Subject();
  private chosenPlaces:Subject<any> = new Subject();
  private controllSlider:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  private thing:string;
  private query:string;
  private image:string;
  private place:any;
  private init:boolean = true;
  private activeThing:any = {};
  private currentPlace:any = {};
  private isDesktop:boolean = isDesktop;
  private isShowImagesFamily:boolean = isDesktop;
  public loader:boolean = false;
  public placeStreetServiceSubscribe:any;
  public isScroll:boolean;
  public places:any[];

  constructor(@Inject(PlaceStreetService)
              private placeStreetService,
              @Inject(UrlChangeService)
              private urlChangeService,
              @Inject(RouteParams)
              private routeParams) {
  }

  ngOnInit() {
    this.thing = this.routeParams.get('thing');
    this.place = this.routeParams.get('place');
    this.image = this.routeParams.get('image');
    this.query = `thing=${this.thing}&place=${this.place}&image=${this.image}`;
    this.getStreetPlaces(this.query);
  }

  ngOnDestroy() {
    this.placeStreetServiceSubscribe.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.places || !this.places.length) {
      return;
    }

    if (document.body.scrollHeight < document.body.clientHeight) {
      return;
    }

    if (!this.isScroll) {
      this.streetPlaces.next(this.places);
    }

    this.isScroll = true;
  }

  urlChanged(thing):void {
    this.activeThing = thing;

    if (this.init) {
      return;
    }

    this.thing = thing._id;
    this.getStreetPlaces(`thing=${thing._id}&place=${this.place}&isSearch=true`);
    this.loader = false;
  }

  isHover() {
    this.hoverHeader.next(null)
  }

  getStreetPlaces(thing) {
    this.placeStreetServiceSubscribe = this.placeStreetService.getThingsByRegion(thing).subscribe((res) => {
      this.places = res.data.places;
      this.sliderPlaces.next(this.places);
    })
  }

  choseCurrentPlace(place) {
    this.currentPlace = place[0];
    this.chosenPlaces.next(place);
    if (!this.isDesktop) {
      this.isShowImagesFamily = false;
    }
    this.changeLocation(place[0], this.thing);
    this.loader = true;
  }

  changeLocation(place, thing) {
    let query = `thing=${thing}&place=${place._id}&image=${place.image}`;
    this.place = place._id;
    this.image = place.image;
    if (this.init) {
      this.init = !this.init;
      return;
    }
    this.urlChangeService.replaceState('/place', query);
    this.routeParams.params = {'thing': thing, 'place': place._id, 'image': place.image}
    this.init = false;
  }
}
