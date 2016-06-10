import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {SocialShareButtons} from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [RouterLink, SocialShareButtons],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent {

}
