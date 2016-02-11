import { Component, OnInit } from 'angular2/core';

let tpl = require('./main.component.html');
let style = require('./main.component.css');

@Component({
  selector: 'main',
  template: tpl,
  styles: [style]
})
export class MainComponent {

}
