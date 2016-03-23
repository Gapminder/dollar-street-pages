import {Component, OnInit, Inject, ElementRef, OnDestroy} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Subject} from "rxjs/Subject";

import {MatrixService} from './matrix.service';
import {MatrixImagesComponent} from './matrix.images.component/matrix.images.component';
import {StreetComponent} from '../common/street/street.component';
import {FooterComponent} from '../common/footer/footer.component';
import {HeaderComponent} from '../common/header/header.component';
import {UrlChangeService} from '../common/url-change/url-change.service';
import {LoaderComponent} from '../common/loader/loader.component';

let _ = require('lodash');
let device = require('device.js')();

let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives: [MatrixImagesComponent, HeaderComponent, StreetComponent, FooterComponent, LoaderComponent]
})

export class MatrixComponent implements OnInit,OnDestroy {
  public query:string;
  public matrixService:MatrixService;
  public places:Subject<any> = new Subject();
  public chosenPlaces:Subject<any> = new Subject();
  public hoverPlace:Subject<any> = new Subject();
  public padding:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  private placesArr:any[];
  private element:HTMLElement;

  private rowEtalon:number = 0;

  private imageHeight:number;
  private footerHeight:number;
  private imageMargin:number;
  private visiblePlaces:number;

  private urlChangeService:UrlChangeService;
  private routeParams:RouteParams;
  private thing:string;
  private countries:string;
  private regions:string;
  private row:number;

  private query:string;
  private zoom:number;
  private isDesktop:boolean = device.desktop();
  private clonePlaces:any[];
  public loader:boolean = false;

  public matrixServiceSubscrib:any;

  constructor(@Inject(MatrixService) matrixService,
              @Inject(ElementRef) element,
              @Inject(UrlChangeService) urlChangeService,
              @Inject(RouteParams) routeParams) {
    this.matrixService = matrixService;
    this.element = element.nativeElement;
    this.routeParams = routeParams;
    this.urlChangeService = urlChangeService;
  }

  ngOnInit():void {
    this.thing = this.routeParams.get('thing');
    this.countries = decodeURI(this.routeParams.get('countries'));
    this.regions = this.routeParams.get('regions');
    //todo: row null
    this.row = parseInt(this.routeParams.get('row'), 10);
    this.zoom = parseInt(this.routeParams.get('zoom'), 10);

    if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
      this.zoom = 5;
    }

    if (!this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 3)) {
      this.zoom = 3;
    }

    if (!this.row) {
      this.row = 1;
    }

    if (!this.thing) {
      this.thing = '546ccf730f7ddf45c0179688';
    }

    if (!this.countries) {
      this.countries = 'World';
    }

    if (!this.regions) {
      this.regions = 'World';
    }

    this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}`;

    document.onscroll = ()=> {
      this.stopScroll();
    };
  }

  ngOnDestroy() {
    document.onscroll = null;
    this.matrixServiceSubscrib.unsubscribe()
  }

  ngAfterViewChecked() {
    let footer = this.element.querySelector('.footer') as HTMLElement;
    let imgContent = this.element.querySelector('.image-content') as HTMLElement;

    if (this.footerHeight === footer.offsetHeight &&
      this.imageHeight === imgContent.offsetHeight || !this.element.querySelector('.image-content')) {

      return;
    }

    this.imageHeight = imgContent.offsetHeight;
    this.footerHeight = footer.offsetHeight;

    this.getPaddings();
  }

  stopScroll() {
    /**  each document usage breaks possible server side rendering*/
    let scrollTop = document.body.scrollTop; //? body.scrollTop : ieScrollBody.scrollTop;
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

    let clonePlaces = _.cloneDeep(this.placesArr);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice(row * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  getPaddings() {
    let windowInnerWidth = window.innerWidth;
    let header = this.element.querySelector('.matrix-header') as HTMLElement;
    this.imageMargin = (windowInnerWidth - this.imageHeight * this.zoom) / (2 * this.zoom);

    let bottomPadding = window.innerHeight - header.offsetHeight - this.footerHeight - this.imageHeight
      - 3 * (windowInnerWidth - this.imageHeight * this.zoom) / (2 * this.zoom);

    if (bottomPadding <= 0) {
      bottomPadding = 0;
    }

    /**use content\view child\childer*/
    let imagesContainer = this.element.querySelector('.images-container') as HTMLElement;
    let imageContainer = this.element.querySelector('.image-content') as HTMLElement;

    imagesContainer.style.paddingTop = `${header.offsetHeight}px`;
    imagesContainer.style.paddingBottom = `${bottomPadding}px`;

    this.getViewableRows(header.offsetHeight);

    document.querySelector('body').scrollTop = (this.row - 1) * (imageContainer.offsetHeight + 2 * this.imageMargin);
    if (this.clonePlaces) {
      this.places.next(this.placesArr);
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  getViewableRows(headerHeight:number):void {
    let windowInnerHeight = window.innerHeight;
    let viewable = windowInnerHeight - headerHeight;
    let distance = viewable / (this.imageHeight + 2 * this.imageMargin);

    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.65) {
      row++;
    }

    this.visiblePlaces = row;

    this.clonePlaces = _.cloneDeep(this.placesArr);

    if (this.clonePlaces && this.clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  hoverPlaceS(place) {
    this.hoverPlace.next(place);
  }

  isHover() {
    if (!this.isDesktop) {
      return;
    }

    this.hoverHeader.next(null);
  }

  urlChanged(query, cb = null):void {
    /**to remove things like this*/
    this.query = query;
    this.thing=this.parseUrl(this.query).thing;
    this.urlChangeService.replaceState(`/matrix`, `${query}`);

    this.matrixServiceSubscrib = this.matrixService.getMatrixImages(query)
      .subscribe((val) => {
        this.places.next(val.places);
        this.placesArr = val.places;
        this.clonePlaces = _.cloneDeep(this.placesArr);
        cb && cb();
        this.loader = true;
      })
  }

  changeZoom(inc) {
    if (this.zoom > 2 && inc < 0) {
      this.zoom--;
    } else if (this.zoom < 10 && inc > 0) {
      this.zoom++;
    } else {
      return;
    }

    this.row = 1;

    this.urlChanged(this.query.replace(/zoom\=\d*/, `zoom=${this.zoom}`).replace(/row\=\d*/, `row=${this.row}`));
  };

  parseUrl(url:string):any {
    url = '{\"' + url.replace(/&/g, '\",\"') + '\"}';
    url = url.replace(/=/g, '\":\"');

    return JSON.parse(url);
  }
}
