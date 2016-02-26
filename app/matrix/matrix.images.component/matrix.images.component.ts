import {Component, Input, EventEmitter, ElementRef, Inject, Output} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from "rxjs/Observable";

let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives:[RouterLink]
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

  private currentPlaces:any = [];
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
