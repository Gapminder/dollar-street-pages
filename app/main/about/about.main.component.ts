import { Component, OnInit } from 'angular2/core';

let tpl = require('./about.main.component.html');
let style = require('./about.main.component.css');

@Component({
  selector: 'about-main',
  template: tpl,
  styles: [style]
})

export class AboutMainComponent {

}
