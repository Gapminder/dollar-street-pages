import {Component, Input, EventEmitter, ElementRef, Inject, Output, OnInit, OnDestroy, OnChanges} from 'angular2/core';
import {Router} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {Angulartics2On} from 'angulartics2/index';

import {RowLoaderComponent} from '../../common/row-loader/row-loader.component';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On, RowLoaderComponent]
})

export class MatrixImagesComponent implements OnInit, OnDestroy, OnChanges {
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
  private itemSize:number;

  constructor(@Inject(ElementRef) element,
              @Inject(Router) router) {
    this.element = element.nativeElement;
    this.router = router;
  }

  ngOnInit():any {
    this.itemSize = window.innerWidth / this.zoom;
    this.placesSubscribe = this.places.subscribe((places) => {
      this.currentPlaces = places;
    });
  }

  ngOnChanges(changes) {
    if (changes.zoom) {
      this.itemSize = window.innerWidth / this.zoom;
    }
  }

  ngOnDestroy() {
    this.placesSubscribe.unsubscribe();
  }

  hoverImage(event, place):void {
    this.hoverPlace.emit(place);

    if (isDesktop) {
      return;
    }
    if (!place) {
      this.oldPlaceId = null;
    }
  }

  goToPlace(place) {
    if (isDesktop) {
      this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);

      return;
    }

    if (!this.oldPlaceId) {
      this.oldPlaceId = place._id;

      return;
    }

    this.router.navigate(['Place', {thing: this.thing, place: place._id, image: place.image}]);
  }

  toUrl(image) {
    return `url("${image}")`;
  }
}
