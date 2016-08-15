import { Component, Inject } from '@angular/core';
let tpl = require('./social-follow-buttons.html');
let style = require('./social-follow-buttons.css');

@Component({
  selector: 'social-follow-buttons',
  template: tpl,
  styles: [style]
})

export class SocialFollowButtonsComponent {
  protected Angulartics2GoogleAnalytics:any;
  public constructor(@Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
  }
}
