import {Component, EventEmitter} from 'angular2/core';
import {MainMenuComponent} from '../menu/menu.component';
import {SearchComponent} from '../search/search.component';

let tpl = require('./header.component.html');
let style = require('./header.component.css');

@Component({
  selector: 'header',
  template: tpl,
  styles: [style],
  inputs: ['query'],
  outputs: ['filter'],
  directives: [SearchComponent, MainMenuComponent]
})

export class HeaderComponent {
  private filter:EventEmitter<any> = new EventEmitter();
  public activeThing:any;

  urlTransfer(url) {
    this.filter.emit(url);
  }

  activeThingTransfer(thing) {
    this.activeThing = thing;
  }
}
