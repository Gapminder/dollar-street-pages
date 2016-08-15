import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { SocialShareButtonsComponent } from '../../common/social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./header.template.html');
let style = require('./header.css');

@Component({
  selector: 'header-first',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, SocialShareButtonsComponent]
})

export class HeaderFirstComponent {
}
