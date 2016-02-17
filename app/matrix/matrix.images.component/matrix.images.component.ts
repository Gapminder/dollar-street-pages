import {Component, Input,EventEmitter} from 'angular2/core';
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
  private hoverPlace: EventEmitter<any>=new EventEmitter();

  private currentPlaces=[];
  @Input('places')
  private places:Observable<any>;

  ngOnInit():any {
    this.places.subscribe((places)=> {
      this.currentPlaces = places;
    })
  }

  //
  hoverImage(place): void {
    this.hoverPlace.emit(place);
  }


}
