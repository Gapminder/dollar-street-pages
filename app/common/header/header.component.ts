import {Component} from 'angular2/core';
import {MainMenuComponent} from '../menu/menu.component';
import {SearchComponent} from '../search/search.component';

let tpl = require('./header.component.html');
let style = require('./header.component.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  directives: [SearchComponent, MainMenuComponent]
})

export class HeaderComponent {
  thing:any = {
    _id: '5477537786deda0b00d43be5',
    name: 'Homes'
  }
}
