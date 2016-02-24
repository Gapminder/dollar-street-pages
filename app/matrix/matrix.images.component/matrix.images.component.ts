import {Component, Input, EventEmitter, ElementRef, Inject, Output} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {
  RouterLink,
} from 'angular2/router';

let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives:[RouterLink]
})

export class MatrixImagesComponent {


  private currentPlaces = [];
  @Input('places')
  private places:Observable<any>;
  @Input('thing')
  private thing:string;
  @Input('zoom')
  private zoom:number;

  @Output('hoverPlace')
  private hoverPlace:EventEmitter<any> = new EventEmitter();

  private element:HTMLElement;


  constructor(@Inject(ElementRef) element) {
    this.element = element.nativeElement
  }

  ngOnInit():any {
    this.places.subscribe((places)=> {
      this.currentPlaces = places;
    });
  }
  private toUrl(image) {
    return `url("${image}")`
  }
  hoverImage(place):void {
    this.hoverPlace.emit(place);
  }
}
