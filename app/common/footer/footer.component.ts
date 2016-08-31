import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { SocialFollowButtonsComponent } from '../social-follow-buttons/social-follow-buttons.component.ts';
import { Config } from '../../app.config';
import * as _ from 'lodash';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, SocialFollowButtonsComponent],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent implements OnInit, OnDestroy {
  protected footerData: any = {};
  protected angulartics2GoogleAnalytics: any;
  private footerService: any;
  private footerServiceSubscribe: Subscription;
  private window: Window = window;
  private isMatrixComponent: boolean;
  private router: Router;
  private routerEventsSubscribe: Subscription;
  private page: string;

  public constructor(router: Router,
                     @Inject('FooterService') footerService: any,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics: any) {
    this.footerService = footerService;
    this.router = router;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): any {
    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        this.isMatrixComponent = activePage === '/matrix';

        activePage = _.compact(activePage.split('/')).shift();

        if (activePage !== this.page) {
          document.body.classList.add(activePage);
          document.body.classList.remove(this.page);
        }

        this.page = activePage;
      }
    });

    this.footerServiceSubscribe = this.footerService.getFooter()
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.footerData = val.data;
      });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.footerServiceSubscribe.unsubscribe();
  }

  protected goToMatrixPage(): void {
    this.angulartics2GoogleAnalytics.eventTrack(`Go to Matrix page from footer `);

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();

    Config.animateScroll('scrollBackToTop', 20, 1000);
  };
}
