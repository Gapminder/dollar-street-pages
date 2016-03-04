import {Component} from 'angular2/core';

import {MainMenuComponent} from '../../common/menu/menu.component';

let tpl = require('./photographer-header.template.html');
let style = require('./photographer-header.css');

@Component({
  selector: 'header-photographer',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent]
})

export class HeaderPhotographerComponent {

}
