import {Component} from 'angular2/core';
import {SocialShareButtons} from '../../common/social_share_buttons/social_share_buttons.component';

let tpl = require('./photographer-header.template.html');
let style = require('./photographer-header.css');

@Component({
  selector: 'header-photographer',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons]
})

export class HeaderPhotographerComponent {

}
