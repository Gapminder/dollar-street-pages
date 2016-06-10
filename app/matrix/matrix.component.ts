import {Component, OnInit, Inject, ElementRef, OnDestroy, AfterViewChecked} from '@angular/core';
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
  public matrixServiceSubscrib:any;
  public loader:boolean = false;
  public isDraw:boolean = false;
  public lowIncome:number;
  public highIncome:number;
  public matrixServiceSubscrib:any;

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
  private placesVal:any;
  private zoom:number;
  private isDesktop:boolean = device.desktop();
  private clonePlaces:any[];

  public constructor(@Inject('MatrixService') matrixService:any,
                     @Inject(ElementRef) element:ElementRef,
                     @Inject('UrlChangeService') urlChangeService:any,
                     @Inject(RouteParams) routeParams:RouteParams) {
    this.matrixService = matrixService;
    this.element = element.nativeElement;
    this.routeParams = routeParams;
    this.urlChangeService = urlChangeService;
  }

  public ngOnInit():void {
    this.thing = this.routeParams.get('thing');
    this.countries = this.routeParams.get('countries') ? decodeURI(this.routeParams.get('countries')) : 'World';
    this.regions = this.routeParams.get('regions');
    // todo: row void 0
    this.row = parseInt(this.routeParams.get('row'), 10);
    this.zoom = parseInt(this.routeParams.get('zoom'), 10);
    this.lowIncome = parseInt(this.routeParams.get('lowIncome'), 10);
    this.highIncome = parseInt(this.routeParams.get('highIncome'), 10);

    if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
      this.zoom = 4;
    }

    if (!this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 3)) {
      this.zoom = 3;
    }

    this.thing = this.thing ? this.thing : '5477537786deda0b00d43be5';
    this.zoom = this.zoom ? this.zoom : 4;
    this.row = this.row ? this.row : 1;
    this.regions = this.regions ? this.regions : 'World';
    this.lowIncome = this.lowIncome ? Math.abs(this.lowIncome) : 0;
    this.highIncome = !this.highIncome || this.highIncome > 15000 ? 15000 : this.highIncome;

    if (this.lowIncome > this.highIncome) {
      this.lowIncome = 0;
    }

    this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;

    this.urlChanged(this.query);

    document.onscroll = () => {
      this.stopScroll();
    };
  }

  public ngOnDestroy():void {
    document.onscroll = void 0;
    this.matrixServiceSubscrib.unsubscribe();
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

    document.querySelector('body').scrollTop = (this.row - 1) * (imageContainer.offsetHeight + 2 * this.imageMargin);

    // if (this.clonePlaces) {
    //   this.streetPlaces.next(this.placesVal);
    //   this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    // }
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

  /** to remove things like this */
  public urlChanged(options:any):void {
    let {url} = options;

    if (url) {
      this.query = url;
    }

    this.urlChangeService.replaceState(`/matrix`, `${this.query}`);

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
          console.log(val.err);
          return;
        }

        this.placesVal = val.data.zoomPlaces;
        let streetPlaces = val.data.streetPlaces;

        this.filtredPlaces = this.placesVal.filter((place:any):boolean=> {
          return place;
        });

        this.matrixPlaces.next(this.filtredPlaces);
        this.placesArr = val.data.zoomPlaces;
        this.clonePlaces = _.cloneDeep(this.filtredPlaces);
        this.zoom = +parseQuery.zoom;
        this.loader = true;
        this.streetPlaces.next(streetPlaces);
        this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

        if (!this.filtredPlaces.length && (Number(parseQuery.lowIncome) !== 0 || Number(parseQuery.highIncome) !== 15000)) {
          this.urlChanged({url: this.query.replace(/lowIncome\=\d*/, `lowIncome=0`).replace(/highIncome\=\d*/, `highIncome=15000`)});
        }
      });
  }

  public changeZoom(zoom:any):void {
    this.urlChanged({url: this.query.replace(/zoom\=\d*/, `zoom=${zoom}`).replace(/row\=\d*/, `row=${this.row}`)});
  };

  public parseUrl(url:string):any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
