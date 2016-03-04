import {Component} from 'angular2/core';

let tpl = require('./loader.component.html');
let style = require('./loader.component.css');

@Component({
  selector: 'loader',
  template: tpl,
  styles: [style]
})

export class LoaderComponent {
}
