import { Component } from '@angular/core';
import { Angulartics2On } from 'angulartics2';
let tpl = require('./social-follow-buttons.html');
let style = require('./social-follow-buttons.css');

@Component({
  selector: 'social-follow-buttons',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On]
})

export class SocialFollowButtonsComponent {
}
