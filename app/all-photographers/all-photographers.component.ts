import {Component} from 'angular2/core';
import {HeaderPhotographersComponent} from './header/header.photographers.component';
import {PhotographersComponent} from './photographers/photographers.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./all-photographers.component.html');
let style = require('./all-photographers.component.css');

@Component({
  selector: 'main',
  template: tpl,
  styles: [style],
  directives: [HeaderPhotographersComponent, PhotographersComponent, FooterComponent]
})

export class AllPhotographersComponent {
}
