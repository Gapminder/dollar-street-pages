import { Component, OnInit } from 'angular2/core';
import {SocialShareButtons} from '../../common/social_share_buttons/social_share_buttons.component.ts';

let tpl = require('./header.main.component.html');
let style = require('./header.main.component.css');

@Component({
  selector: 'header-main',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons]
})

export class HeaderMainComponent {

}
