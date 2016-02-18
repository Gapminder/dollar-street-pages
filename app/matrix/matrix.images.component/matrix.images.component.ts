import {Component, Input, EventEmitter, ElementRef, Inject} from 'angular2/core';
import {Observable} from "rxjs/Observable";


let tpl = require('./matrix.images.component.html');
let style = require('./matrix.images.component.css');

@Component({
  selector: 'matrix-images',
  outputs: ['hoverPlace'],
  template: tpl,
  styles: [style],
})

export class MatrixImagesComponent {
  private hoverPlace:EventEmitter<any> = new EventEmitter();

  private currentPlaces = [];
  @Input('places')
  private places:Observable<any>;
  // @Input('padding')
  // private padding:Observable<any>;
  private element:HTMLElement;


  constructor(@Inject(ElementRef) element) {
    this.element = element.nativeElement
  }

  ngOnInit():any {
    this.places.subscribe((places)=> {
      this.currentPlaces = places;
    })
    // this.padding.subscribe((padding)=> {
    //   this.paddingTop = padding.top;
    //   this.paddingBottom = padding.bottom;
    // })
  }

  //
  hoverImage(place):void {
    this.hoverPlace.emit(place);
  }


}
