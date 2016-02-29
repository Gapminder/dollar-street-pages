import {Component} from 'angular2/core';
import {HeaderPhotographerComponent} from './header/photographer-header.component';
import {PhotographerProfileComponent} from './photographer-profile/photographer-profile.component';
import {FooterComponent} from '../common/footer/footer.component';

let tpl = require('./photographer.template.html');
let style = require('./photographer.css');

@Component({
  selector: 'photographer',
  template: tpl,
  styles: [style],
  directives: [HeaderPhotographerComponent, PhotographerProfileComponent, FooterComponent]
})

export class PhotographerComponent {
}
