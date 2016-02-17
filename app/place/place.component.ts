import { Component } from 'angular2/core';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./place.component.html');
let style = require('./place.component.css');


@Component({
  selector: 'place',
  template: tpl,
  styles: [style],
  directives: [FooterComponent]
})
export class PlaceComponent {

}
