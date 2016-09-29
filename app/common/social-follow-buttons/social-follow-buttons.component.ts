import { Component } from '@angular/core';
let tpl = require('./social-follow-buttons.html');
let style = require('./social-follow-buttons.css');

@Component({
  selector: 'social-follow-buttons',
  template: tpl,
  styles: [style]
})

export class SocialFollowButtonsComponent {
}
