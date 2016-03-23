import { Component, OnInit } from 'angular2/core';

let tpl = require('./about.main.template.html');
let style = require('./about.main.css');

@Component({
  selector: 'about-main',
  template: tpl,
  styles: [style]
})

export class AboutMainComponent {

}
