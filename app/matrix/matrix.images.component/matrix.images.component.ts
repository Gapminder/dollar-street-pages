import {Component, Input, EventEmitter, ElementRef, Inject} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {
  RouterLink,
} from 'angular2/router';

let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  outputs: ['hoverPlace'],
  template: tpl,
  styles: [style],
  directives:[RouterLink]
})

export class MatrixImagesComponent {
  private hoverPlace:EventEmitter<any> = new EventEmitter();

  private currentPlaces = [];
  @Input('places')
  private places:Observable<any>;
  @Input('thing')
  private thing:string;
  @Input('zoom')
  private zoom:number;
  
  private element:HTMLElement;


  constructor(@Inject(ElementRef) element) {
    this.element = element.nativeElement
  }

  ngOnInit():any {
    this.places.subscribe((places)=> {
      this.currentPlaces = places;
    });
  }

  hoverImage(place):void {
    this.hoverPlace.emit(place);
  }
}
