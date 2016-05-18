import {Component, Inject, OnInit, OnDestroy, AfterViewChecked, ElementRef, NgZone} from '@angular/core';
import {RouteParams, RouterLink} from '@angular/router-deprecated';
import {Subject} from 'rxjs/Subject';

import {FooterComponent} from '../common/footer/footer.component';
import {StreetComponent} from '../common/street/street.component';
import {HeaderComponent} from '../common/header/header.component';
import {SliderPlaceComponent} from './slider/slider-place.component.ts';
import {SliderMobilePlaceComponent} from './slider-mobile/slider-mobile-place.component.ts';
import {FamilyPlaceComponent} from './family/family-place.component.ts';
import {LoaderComponent} from '../common/loader/loader.component';
import {fromEvent} from 'rxjs/observable/fromEvent';

let tpl = require('./place.template.html');
let style = require('./place.css');

let device = require('device.js')();
let isDesktop = device.desktop();

@Component({
  selector: 'place',
  template: tpl,
  styles: [style],
  directives: [RouterLink, HeaderComponent, StreetComponent, isDesktop ? SliderPlaceComponent : SliderMobilePlaceComponent, FamilyPlaceComponent, FooterComponent, LoaderComponent]
})

export class PlaceComponent implements OnInit, OnDestroy,AfterViewChecked {
  public loader:boolean = false;
  public placeStreetServiceSubscribe:any;
  public getCommonAboutDataServiceSubscribe:any;
  public isScroll:boolean;
  public places:any[];
  public placeStreetService:any;
  public urlChangeService:any;
  public routeParams:RouteParams;
  public zone:NgZone;
  public windowHeight:number = window.innerHeight;
  public maxHeightPopUp:number = this.windowHeight * .95 - 91;
  public hoverPlace:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  public resizeSubscribe:any;
  public positionLeft:number;
  public positionTop:number;
  public showMobileAboutData:boolean;
  private streetPlaces:Subject<any> = new Subject();
  private sliderPlaces:Subject<any> = new Subject();
  private chosenPlaces:Subject<any> = new Subject();
  private controllSlider:Subject<any> = new Subject();
  private controllSliderSubscribe:any;
  private thing:string;
  private query:string;
  private image:string;
  private commonAboutData:any;
  private place:any;
  private init:boolean = true;
  private showAboutData:boolean;
  private activeThing:any = {};
  private currentPlace:any = {};
  private isDesktop:boolean = isDesktop;
  private element:HTMLElement;

  public constructor(@Inject('PlaceStreetService') placeStreetService:any,
                     @Inject('UrlChangeService') urlChangeService:any,
                     @Inject(ElementRef) element:any,
                     @Inject(RouteParams) routeParams:RouteParams,
                     @Inject(NgZone) zone:NgZone) {
    this.placeStreetService = placeStreetService;
    this.urlChangeService = urlChangeService;
    this.routeParams = routeParams;
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit():void {
    this.thing = this.routeParams.get('thing');
    this.place = this.routeParams.get('place');
    this.image = this.routeParams.get('image');
    this.query = `thing=${this.thing}&place=${this.place}&image=${this.image}`;
    this.getStreetPlaces(this.query);

    this.getCommonAboutDataServiceSubscribe = this.placeStreetService
      .getCommonAboutData()
      .subscribe((res:any):void => {
        this.commonAboutData = res.data;
      });

    this.controllSliderSubscribe = this.controllSlider
      .subscribe(() => {
        this.zone.run(() => {
          this.loader = false;
        });
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowHeight = window.innerHeight;
          this.maxHeightPopUp = this.windowHeight * .95 - 91;
        });
      });
  }

  public ngOnDestroy():void {
    this.placeStreetServiceSubscribe.unsubscribe();
    this.controllSliderSubscribe.unsubscribe();
    this.getCommonAboutDataServiceSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();
  }

  public ngAfterViewChecked():void {
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

  public urlChanged(thing:any):void {
    this.activeThing = thing;
    if (this.init) {
      return;
    }
    this.thing = thing._id;
    this.getStreetPlaces(`thing=${thing._id}&place=${this.place}&isSearch=true`);
    this.zone.run(() => {
      this.loader = false;
    });
  }

  public isHover():void {
    this.hoverHeader.next(false);
  }

  public getStreetPlaces(thing:any):void {
    this.placeStreetServiceSubscribe = this.placeStreetService.getThingsByRegion(thing).subscribe((res:any):any => {
      this.places = res.data.places;
      this.sliderPlaces.next(this.places);
    });
  }

  public choseCurrentPlace(place:any):void {
    this.currentPlace = place[0];
    this.chosenPlaces.next(this.currentPlace);
    this.hoverPlace.next(this.currentPlace);

    this.changeLocation(place[0], this.thing);

    this.zone.run(() => {
      this.loader = true;
    });
  }

  public isShowAboutData(elementData?:any):void {
    if (elementData && (elementData.isDevice || elementData.fixed)) {
      this.showMobileAboutData = true;
      this.showAboutData = true;

      return;
    }

    if (!elementData || !elementData.left || !elementData.top) {
      this.showAboutData = false;

      return;
    }

    let aboutDataContainer = this.element.querySelector('.about-data-container');

    this.positionLeft = elementData.left + 28;
    this.positionTop = elementData.top - (aboutDataContainer.clientHeight / 2);

    this.showAboutData = true;
  }

  public closeAboutDataPopUp(event:MouseEvent):void {
    let el = event && event.target as HTMLElement;

    if (el.className.indexOf('closeMenu') !== -1) {
      this.showAboutData = false;
      this.showMobileAboutData = false;
    }
  }

  public changeLocation(place:any, thing:any):void {
    let query = `thing=${thing}&place=${place._id}&image=${place.image}`;
    this.place = place._id;
    this.image = place.image;

    if (this.init) {
      this.init = !this.init;
      return;
    }

    this.urlChangeService.replaceState('/place', query);
    this.routeParams.params = {'thing': thing, 'place': place._id, 'image': place.image};

    this.init = false;
  }
}
