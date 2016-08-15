import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

@Component({
  selector: 'consumer-app',
  template: '<router-outlet></router-outlet>',
  providers: [Angulartics2GoogleAnalytics],
  directives: [ROUTER_DIRECTIVES],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  private angulartics2: Angulartics2;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;

  public constructor(angulartics2: Angulartics2,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.angulartics2 = angulartics2;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }
}
