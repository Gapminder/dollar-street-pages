import { Component } from 'angular2/core';

let tpl = require('./place.component.html');
let style = require('./place.component.css');


@Component({
  selector: 'place',
  template: tpl,
  styles: [style]
})
export class PlaceComponent {

}
