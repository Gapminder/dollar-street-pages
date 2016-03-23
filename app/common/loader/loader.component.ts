import {Component} from 'angular2/core';

let tpl = require('./loader.template.html');
let style = require('./loader.css');

@Component({
  selector: 'loader',
  template: tpl,
  styles: [style]
})

export class LoaderComponent {
}
