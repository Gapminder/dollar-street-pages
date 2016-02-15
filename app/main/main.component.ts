import { Component, OnInit } from 'angular2/core';
import {HeaderMainComponent} from './header/header.main.component';
import {AboutMainComponent} from './about/about.main.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./main.component.html');
let style = require('./main.component.css');

@Component({
  selector: 'main',
  template: tpl,
  styles: [style],
  directives: [HeaderMainComponent, FooterComponent, AboutMainComponent]
})

export class MainComponent {

}
