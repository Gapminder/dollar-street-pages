import {Component, Input, EventEmitter, ElementRef, Inject, Output} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from "rxjs/Observable";

import {Angulartics2On} from 'angulartics2/index';
import {Angulartics2GoogleAnalytics} from 'angulartics2/providers/angulartics2-google-analytics';

let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [RouterLink, Angulartics2On]
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

  private angulartics2GoogleAnalytics:Angulartics2GoogleAnalytics;
  private currentPlaces:any = [];
  private element:HTMLElement;


  constructor(@Inject(ElementRef) element,
              @Inject(Angulartics2GoogleAnalytics) angulartics2GoogleAnalytics) {
    this.element = element.nativeElement;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  ngOnInit():any {
    this.places.subscribe((places)=> {
      this.currentPlaces = places;
    });
  }

  hoverImage(place):void {
    this.hoverPlace.emit(place);
  }

  private toUrl(image) {
    return `url("${image}")`;
  }
}
