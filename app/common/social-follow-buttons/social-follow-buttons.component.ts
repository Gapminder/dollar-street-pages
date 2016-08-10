import { Component, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Angulartics2On } from 'angulartics2';
let tpl = require('./social-follow-buttons.html');
let style = require('./social-follow-buttons.css');

@Component({
  selector: 'social-follow-buttons',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On, ROUTER_DIRECTIVES]
})

export class SocialFollowButtonsComponent {
  private element: ElementRef;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private angulartics2GoogleAnalytics: any;

  public constructor(@Inject(Router) router: Router,
                     @Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics: any) {
    this.element = element;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }


}
