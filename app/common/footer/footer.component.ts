import { Component, OnInit } from 'angular2/core';
import {SocialShareButtons} from '../social_share_buttons/social_share_buttons.component';

let tpl = require('./footer.component.html');
let style = require('./footer.component.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons]
})

export class FooterComponent {

}
