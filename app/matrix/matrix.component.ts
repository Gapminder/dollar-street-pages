import {Component, OnInit, Inject, ElementRef} from 'angular2/core';

import {
  RouteParams,
} from 'angular2/router';

import {MatrixService} from './matrix.service';
import {MatrixImagesComponent} from './matrix.images.component/matrix.images.component';
import {StreetComponent} from '../common/street/street.component';
import {FooterComponent} from '../common/footer/footer.component';
import {HeaderComponent} from '../common/header/header.component';
import {Subject} from "rxjs/Subject";

let _ = require('lodash');


let tpl = require('./matrix.component.html');
let style = require('./matrix.component.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives: [MatrixImagesComponent, HeaderComponent, StreetComponent, FooterComponent]
})

export class MatrixComponent implements OnInit {
  public query:string;
  public matrixService:MatrixService;
  public places:Subject<any> = new Subject();
  public chosenPlaces:Subject<any> = new Subject();
  public hoverPlace:Subject<any> = new Subject();
  public padding:Subject<any> = new Subject();
  public hoverHeader:Subject<any> = new Subject();
  private placesArr:any[];
  private element:HTMLElement;

  private imageHeight:number;
  private footerHeight:number;
  private imageMargin:number;

  private routeParams:RouteParams;
  private thing:string;
  private countries:string;
  private regions:string;

  constructor(@Inject(MatrixService) matrixService,
              @Inject(ElementRef) element,
              @Inject(RouteParams) routeParams) {
    this.matrixService = matrixService;
    this.element = element.nativeElement;
    this.routeParams = routeParams;
  }

  ngOnInit():void {
    this.thing = this.routeParams.get('thing');
    this.countries = this.routeParams.get('countries');
    this.regions = this.routeParams.get('regions');

    if (!this.thing) {
      this.thing = '546ccf730f7ddf45c0179688';
    }

    if (!this.countries) {
      this.countries = 'World';
    }

    if (!this.regions) {
      this.regions = 'World';
    }

    this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}`;

    this.urlChanged(this.query);

    document.addEventListener('scroll', ()=> {
      this.stopScroll()
    });
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

    this.getPaddings()
  }

  stopScroll() {
    row = 0;
    let scrollTop = document.body.scrollTop //? body.scrollTop : ieScrollBody.scrollTop;
    var distance = scrollTop / ( this.imageHeight + 2 * this.imageMargin);
    var rest = distance % 1;
    row = distance - rest;

    if (rest >= 0.65) {
      row++;
    }

    let clonePlaces = _.cloneDeep(this.placesArr);

    if (clonePlaces && clonePlaces.length) {
      this.chosenPlaces.next(clonePlaces.splice(row * 5, 5));
    }
  }


  getPaddings() {
    let windowInnerWidth = document.querySelector('body').scrollWidth;
    let header = this.element.querySelector('.matrix-header') as HTMLElement;
    this.imageMargin = (windowInnerWidth - this.imageHeight * 5) / (2 * 5);

    let bottomPadding = window.innerHeight - header.offsetHeight - this.footerHeight - this.imageHeight
      - 3 * (windowInnerWidth - this.imageHeight * 5) / (2 * 5);

    if (bottomPadding <= 0) {
      bottomPadding = 0;
    }

    let imagsConteiner = this.element.querySelector('.images-container') as HTMLElement;
    imagsConteiner.style.paddingTop = `${header.offsetHeight}px`;
    imagsConteiner.style.paddingBottom = `${bottomPadding}px`;

  }

  hoverPlaceS(place) {
    this.hoverPlace.next(place)
  }

  isHover() {
    this.hoverHeader.next(null)
  }


  urlChanged(query):void {
    this.matrixService.getMatrixImages(query)
      .subscribe((val) => {
        this.places.next(val.places);
        this.placesArr = val.places;
        let clonePlaces = _.cloneDeep(this.placesArr);

        if (clonePlaces && clonePlaces.length) {
          this.chosenPlaces.next(clonePlaces.splice((1 - 1) * 5, 5));
        }
      })
  }
}
