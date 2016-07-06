import {Component, OnInit, Inject, ElementRef, OnDestroy, AfterViewChecked, NgZone} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Subject} from 'rxjs/Subject';

import {MatrixImagesComponent} from './matrix-images/matrix-images.component';
import {StreetComponent} from '../common/street/street.component';
import {FooterComponent} from '../common/footer/footer.component';
import {HeaderComponent} from '../common/header/header.component';
import {LoaderComponent} from '../common/loader/loader.component';

let _ = require('lodash');
let device = require('device.js')();

let tpl = require('./matrix.template.html');
let style = require('./matrix.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives: [MatrixImagesComponent, HeaderComponent, StreetComponent, FooterComponent, LoaderComponent]
})
export class MatrixComponent implements OnInit, OnDestroy, AfterViewChecked {
  protected filtredPlaces:any[] = [];
  protected headerOnboard:string;
  protected showOnboarding:boolean = true;
  protected showOnboardingSwitcher:boolean = false;
  protected switchOnQuickTour:boolean = false;
  protected numberOfStep:number = 1;
  protected baloonTips:any = {};
  protected baloonTip:any = {};

  public query:string;
  public matrixService:any;
  public streetPlaces:Subject<any> = new Subject();
  public matrixPlaces:Subject<any> = new Subject();
  public chosenPlaces:Subject<any> = new Subject();
  public hoverPlace:Subject<any> = new Subject();
  public padding:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  public loader:boolean = false;
  public isDraw:boolean = false;
  public lowIncome:number;
  public highIncome:number;
  public matrixServiceSubscrib:any;
  public matrixServiceOnboarding:any;

  private placesArr:any[];
  private element:HTMLElement;
  private rowEtalon:number = 0;
  private imageHeight:number;
  private footerHeight:number;
  private imageMargin:number;
  private visiblePlaces:number;
  private urlChangeService:any;
  private routeParams:RouteParams;
  private thing:string;
  private countries:string;
  private regions:string;
  private row:number;
  private activeHouse:number;
  private placesVal:any;
  private zoom:number;
  private isDesktop:boolean = device.desktop();
  private clonePlaces:any[];
  private zone:NgZone;
  private windowHistory:any = history;

  public constructor(@Inject('MatrixService') matrixService:any,
                     @Inject(ElementRef) element:ElementRef,
                     @Inject('UrlChangeService') urlChangeService:any,
                     @Inject(RouteParams) routeParams:RouteParams,
                     @Inject(NgZone) zone:NgZone) {
    this.matrixService = matrixService;
    this.element = element.nativeElement;
    this.routeParams = routeParams;
    this.urlChangeService = urlChangeService;
    this.zone = zone;
  }

  public ngOnInit():void {

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }
    if (window.localStorage && window.localStorage.getItem('onboarded')) {
      this.showOnboarding = false;
      this.showOnboardingSwitcher = true;
      document.body.className = 'wizard';
    }

    this.matrixServiceOnboarding = this.matrixService.getMatrixOnboardingTips()
      .subscribe((val:any) => {
        if (val.err) {
          console.log(val.err);

          return;
        }

        this.baloonTips = val.data;

        this.headerOnboard = _.find(this.baloonTips, ['name', 'welcomeHeader']);
      });

    this.thing = this.routeParams.get('thing');
    this.countries = this.routeParams.get('countries') ? decodeURI(this.routeParams.get('countries')) : 'World';
    this.regions = this.routeParams.get('regions');
    this.zoom = parseInt(this.routeParams.get('zoom'), 10);
    this.lowIncome = parseInt(this.routeParams.get('lowIncome'), 10);
    this.highIncome = parseInt(this.routeParams.get('highIncome'), 10);
    this.activeHouse = parseInt(this.routeParams.get('activeHouse'), 10);

    if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
      this.zoom = 4;

    }

    if (!this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 3)) {
      this.zoom = 3;
    }

    // todo: row void 0
    let getRow = parseInt(this.routeParams.get('row'), 10);

    this.row = this.activeHouse ? Math.ceil(this.activeHouse / this.zoom) : getRow || 1;

    this.thing = this.thing ? this.thing : 'Home';
    this.zoom = this.zoom ? this.zoom : 4;
    this.regions = this.regions ? this.regions : 'World';
    this.lowIncome = this.lowIncome ? Math.abs(this.lowIncome) : 0;
    this.highIncome = !this.highIncome || this.highIncome > 15000 ? 15000 : this.highIncome;

    if (this.lowIncome > this.highIncome) {
      this.lowIncome = 0;
    }

    this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;

    if (this.activeHouse) {
      this.query = this.query + `&activeHouse=${this.activeHouse}`;
    }

    this.urlChanged({isInit: true});

    document.onscroll = () => {
      this.stopScroll();
    };
  }

  public ngOnDestroy():void {
    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }

    document.onscroll = void 0;
    this.matrixServiceSubscrib.unsubscribe();
    this.matrixServiceOnboarding.unsubscribe();
  }

  public ngAfterViewChecked():void {
    let footer = this.element.querySelector('.footer') as HTMLElement;
    let imgContent = this.element.querySelector('.image-content') as HTMLElement;

    if (!imgContent) {
      return;
    }

    if (this.footerHeight === footer.offsetHeight &&
      this.imageHeight === imgContent.offsetHeight || !this.element.querySelector('.image-content')) {
      return;
    }
    this.imageHeight = imgContent.offsetHeight;
    this.footerHeight = footer.offsetHeight;
    this.getPaddings();
  }

  /** each document usage breaks possible server side rendering */
  public stopScroll():void {
    let scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    let distance = scrollTop / (this.imageHeight + 2 * this.imageMargin);

    if (isNaN(distance)) {
      return;
    }

    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.65) {
      row++;
    }

    this.row = row + 1;

    if (this.rowEtalon !== this.row) {
      this.rowEtalon = this.row;
      let query = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;

      this.urlChangeService.replaceState(`/matrix`, query);
    }

    let clonePlaces = _.cloneDeep(this.filtredPlaces);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  public getPaddings():void {
    let windowInnerWidth = window.innerWidth;
    let header = this.element.querySelector('.matrix-header') as HTMLElement;
    this.imageMargin = (windowInnerWidth - this.imageHeight * this.zoom) / (2 * this.zoom);

    /** se content\view child\childer */

    let matrixImages = this.element.querySelector('matrix-images') as HTMLElement;
    let imageContainer = this.element.querySelector('.image-content') as HTMLElement;

    if (!imageContainer) {
      return;
    }

    matrixImages.style.paddingTop = `${header.offsetHeight}px`;

    this.getViewableRows(header.offsetHeight);

    document.body.scrollTop = document.documentElement.scrollTop = (this.row - 1) * (imageContainer.offsetHeight + 2 * this.imageMargin);

    if (this.clonePlaces) {
      this.streetPlaces.next(this.placesVal);
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    }
  }

  public getViewableRows(headerHeight:number):void {
    let windowInnerHeight = window.innerHeight;
    let viewable = windowInnerHeight - headerHeight;
    let distance = viewable / (this.imageHeight + 2 * this.imageMargin);
    let rest = distance % 1;
    let row = distance - rest;
    if (rest >= 0.65) {
      row++;
    }

    this.visiblePlaces = row;

    this.clonePlaces = _.cloneDeep(this.filtredPlaces);
  }

  public hoverPlaceS(place:any):void {
    this.hoverPlace.next(place);
  }

  public isHover():void {
    if (!this.isDesktop) {
      return;
    }

    this.hoverHeader.next(void 0);
  }

  public urlChanged(options:any):void {
    let {url, isZoom, isCountriesFilter, isInit} = options;

    if (url) {
      this.query = isZoom ? url.replace(/row\=\d*/, 'row=1') : url;
      this.row = isZoom ? this.row : 1;
    }

    if (!isInit) {
      this.query = this.query.replace(/&activeHouse\=\d*/, '');
      this.activeHouse = void 0;
    }

    let parseQuery = this.parseUrl(this.query);
    this.thing = parseQuery.thing;
    this.loader = false;

    if (this.matrixServiceSubscrib) {
      this.matrixServiceSubscrib.unsubscribe();
      this.matrixServiceSubscrib = void 0;
    }

    this.matrixServiceSubscrib = this.matrixService.getMatrixImages(this.query)
      .subscribe((val:any) => {
        if (val.err) {
          return;
        }

        this.placesVal = val.data.zoomPlaces;
        let streetPlaces = val.data.streetPlaces;

        this.filtredPlaces = this.placesVal.filter((place:any):boolean => {
          return place;
        });

        this.matrixPlaces.next(this.filtredPlaces);
        this.placesArr = val.data.zoomPlaces;
        this.clonePlaces = _.cloneDeep(this.filtredPlaces);
        this.zoom = +parseQuery.zoom;
        this.loader = true;

        let incomesArr = _
          .chain(streetPlaces)
          .map('income')
          .sortBy()
          .value();

        this.streetPlaces.next(streetPlaces);
        this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

        if (!this.filtredPlaces.length && isCountriesFilter && (Number(parseQuery.lowIncome) !== 0 || Number(parseQuery.highIncome) !== 15000)) {
          this.query = this.query
            .replace(/lowIncome\=\d*/, `lowIncome=${Math.floor(incomesArr[0] - 10)}`)
            .replace(/highIncome\=\d*/, `highIncome=${Math.ceil(incomesArr[incomesArr.length - 1] + 10)}`);

          this.urlChanged({url: this.query});
        }

        this.urlChangeService.replaceState('/matrix', this.query);

        if (!isZoom) {
          if (document.body.scrollTop) {
            document.body.scrollTop = 0;
          } else {
            document.documentElement.scrollTop = 0;
          }
        }
      });
  }

  public activeHouseOptions(options:any):void {
    let {row, activeHouseIndex} = options;

    this.query = this.query.replace(/row\=\d*/, `row=${row}`).replace(/&activeHouse\=\d*/, '');

    if (activeHouseIndex) {
      this.activeHouse = activeHouseIndex;
      this.query = this.query + `&activeHouse=${activeHouseIndex}`;
    } else {
      this.activeHouse = void 0;
    }

    this.urlChangeService.replaceState('/matrix', this.query);
  }

  public changeZoom(zoom:any):void {
    this.urlChanged({
      url: this.query.replace(/zoom\=\d*/, `zoom=${zoom}`).replace(/row\=\d*/, `row=${this.row}`),
      isZoom: true
    });
  };

  public parseUrl(url:string):any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  protected getCoords(querySelector:String, cb:any):any { // crossbrowser version
    let box = this.element.querySelector(querySelector).getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;

    let top = box.top;
    let left = box.left + scrollLeft - clientLeft;

    if (querySelector === '.images-container') {
      top = box.top + scrollTop - clientTop;
    }
    cb({top: Math.round(top) + 40, left: Math.round(left) + 20});
  }

  protected startQuickTour():void {
    this.switchOnOnboarding(false);
    this.showOnboardingSwitcher = false;
    this.numberOfStep = 1;
    window.localStorage.setItem('onboarded', 'true');
    this.baloonTip = _.find(this.baloonTips, ['name', 'thing']);
    this.switchOnQuickTour = true;

    setTimeout(() => {
      this.getCoords('things-filter', (data:any) => {
        this.baloonTip.position = data;
      });
    });
  }

  protected closeQuickTour():void {
    this.showOnboardingSwitcher = true;
    this.switchOnQuickTour = false;
  }

  protected step(step:boolean):void {
    let baloonDirector:string;

    if (step) {
      this.numberOfStep++;
    }
    if (!step) {
      this.numberOfStep--;
    }

    if (this.numberOfStep === 1) {
      baloonDirector = 'things-filter';
      this.baloonTip = _.find(this.baloonTips, ['name', 'thing']);
    }

    if (this.numberOfStep === 2) {
      baloonDirector = 'incomes-filter';
      this.baloonTip = _.find(this.baloonTips, ['name', 'income']);
    }

    if (this.numberOfStep === 3) {
      baloonDirector = 'countries-filter';
      this.baloonTip = _.find(this.baloonTips, ['name', 'geography']);
    }

    if (this.numberOfStep === 4) {
      baloonDirector = '.street-box';
      this.baloonTip = _.find(this.baloonTips, ['name', 'street']);
    }

    if (this.numberOfStep === 5) {
      baloonDirector = '.images-container';
      this.baloonTip = _.find(this.baloonTips, ['name', 'image']);
    }

    setTimeout(() => {
      this.getCoords(baloonDirector, (data:any) => {
        this.baloonTip.position = data;
      });
    });
  }

  protected switchOnOnboarding(closeOnboarding:boolean):void {
    let matrixImages = this.element.querySelector('matrix-images') as HTMLElement;
    let zoomButtons = this.element.querySelector('.zoom-column') as HTMLElement;
    let header = this.element.querySelector('.matrix-header') as HTMLElement;
    let onboard = this.element.querySelector('.matrix-onboard') as HTMLElement;

    if (!closeOnboarding) {
      document.body.className = '';
      setTimeout(function ():void {
        matrixImages.style.paddingTop = `${header.offsetHeight}px`;
        zoomButtons.style.paddingTop = `${onboard.offsetHeight + 20}px`;
      }, 0);
      this.showOnboarding = false;
      this.showOnboardingSwitcher = true;
      return;
    }

    this.showOnboarding = true;
    this.showOnboardingSwitcher = false;
    this.switchOnQuickTour = false;

    setTimeout(function ():void {
      matrixImages.style.paddingTop = `${header.offsetHeight}px`;
      zoomButtons.style.paddingTop = `${onboard.offsetHeight}px`;
    }, 0);
  }
}
