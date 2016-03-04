import {Component} from 'angular2/core';
import {MainMenuComponent} from '../../common/menu/menu.component';

let tpl = require('./header.photographers.component.html');
let style = require('./header.photographers.component.css');

@Component({
  selector: 'header-photographers',
  template: tpl,
  styles: [style],
  directives: [MainMenuComponent]
})

export class HeaderPhotographersComponent {

}
