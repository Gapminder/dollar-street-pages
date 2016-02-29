import {Component} from 'angular2/core';
import {HeaderPhotographerComponent} from './header/header.photographer.component';
import {PhotographerPhotographerComponent} from './photographer/photographer.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./photographer.component.html');
let style = require('./photographer.component.css');

@Component({
  selector: 'main',
  template: tpl,
  styles: [style],
  directives: [HeaderPhotographerComponent, PhotographerComponent, FooterComponent]
})

export class PhotographerComponent {
}
