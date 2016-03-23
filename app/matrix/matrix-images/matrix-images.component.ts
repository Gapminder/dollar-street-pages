const device = require('device.js')();
const isDesktop = device.desktop();

import {Component, Input, EventEmitter, ElementRef, Inject, Output,OnInit,OnDestroy} from 'angular2/core';
import {Router} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {Angulartics2On} from 'angulartics2/index';

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On]
})

export class MatrixImagesComponent implements OnInit,OnDestroy {
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
  private currentPlaces:any = [];
  private element:HTMLElement;
  private placesSubscribe:any;


  constructor(@Inject(ElementRef) element,
              @Inject(Router) router) {
    this.element = element.nativeElement;
    this.router = router;
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
