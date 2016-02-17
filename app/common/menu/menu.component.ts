import {Component} from 'angular2/core';
import {SocialShareButtons} from '../social_share_buttons/social_share_buttons.component';

let tpl = require('./menu.component.html');
let style = require('./menu.component.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  inputs: ['thing'],
  directives: [SocialShareButtons]
})

export class MainMenuComponent {
  isOpen:boolean = false;
}
