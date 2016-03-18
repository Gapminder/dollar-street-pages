const device = require('device.js')();
const isDesktop = device.desktop();

import {Component, Input, EventEmitter, ElementRef, Inject, Output} from 'angular2/core';
import {Router} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {Angulartics2On} from 'angulartics2/index';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On]
})

export class MatrixImagesComponent {
  @Input('places')
  private places:Observable<any>;
  @Input('thing')
  private thing:string;
  @Input('zoom')
  private zoom:number;

  @Output('hoverPlace')
  private hoverPlace:EventEmitter<any> = new EventEmitter();

  private isDesktop:boolean = isDesktop;
  private oldPlaceId:string;
  private router:Router;
  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;
  private currentPlaces:any = [];
  private element:HTMLElement;
  private placesSubscribe:any;


  constructor(@Inject(ElementRef) element,
              @Inject(Router) router,
              @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.element = element.nativeElement;
    this.router = router;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  ngOnInit():any {
    this.placesSubscribe = this.places.subscribe((places)=> {
      this.currentPlaces = places;
    });
  }

  ngOnDestroy() {
    this.placesSubscribe.unsubscribe()
  }

  hoverImage(event, place):void {

    this.hoverPlace.emit(place);
    if (isDesktop) {
      return
    }
    if (!place) {
      this.oldPlaceId = null;
      return;
    }
  }

  goToPlace(place) {
    if (isDesktop) {
      this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}])
      return
    }
    if (!this.oldPlaceId) {
      this.oldPlaceId = place._id
      return;
    }
    this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}])
  }

  private toUrl(image) {
    return `url("${image}")`;
  }
}
