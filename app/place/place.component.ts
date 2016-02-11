import { Component } from 'angular2/core';

let tpl = require('./place.component.html');
let style = require('./place.component.css');


@Component({
  selector: 'place',
  templateUrl: tpl,
  styleUrls: [style]
})
export class PlaceComponent {

}
