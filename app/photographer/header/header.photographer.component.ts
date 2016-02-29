import {Component} from 'angular2/core';
import {SocialShareButtons} from '../../common/social_share_buttons/social_share_buttons.component';

let tpl = require('./header.photographer.component.html');
let style = require('./header.photographer.component.css');

@Component({
  selector: 'header-photographer',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtons]
})

export class HeaderPhotographerComponent {

}
