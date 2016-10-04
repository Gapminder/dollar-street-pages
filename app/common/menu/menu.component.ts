import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

let device = require('device.js')();
let isMobile = device.mobile();

let tplMobile = require('./menu-mobile.template.html');
let styleMobile = require('./menu-mobile.css');

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: isMobile ? tplMobile : tpl,
  styles: [isMobile ? styleMobile : style]
})

export class MainMenuComponent implements OnInit, OnDestroy {
  protected isOpenMenu: boolean = false;
  protected angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  @Input()
  private hoverPlace: Observable<any>;
  private hoverPlaceSubscribe: Subscription;
  private element: HTMLElement;
  private router: Router;
  private isMatrixComponent: boolean;
  private window: Window = window;
  private routerEventsSubscribe: Subscription;
  private activatedRoute: ActivatedRoute;

  public constructor(router: Router,
                     element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.element = element.nativeElement;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): void {
    let activatedRoutePath = this.activatedRoute.snapshot.url.shift();

    if (activatedRoutePath) {
      this.isMatrixComponent = activatedRoutePath.path === 'matrix';
    } else {
      this.routerEventsSubscribe = this.router
        .events
        .subscribe((event: any) => {
          if (event instanceof NavigationEnd) {
            let activePage: string = event
              .urlAfterRedirects
              .split('?')
              .shift();

            this.isMatrixComponent = activePage === '/matrix';
          }
        });
    }

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace
        .subscribe(() => {
          if (this.isOpenMenu) {
            this.isOpenMenu = false;
          }
        });
  }

  public ngOnDestroy(): void {
    if (this.routerEventsSubscribe) {
      this.routerEventsSubscribe.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    if (isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  protected openMenu(isOpenMenu: boolean): void {
    this.isOpenMenu = !isOpenMenu;

    if (this.isOpenMenu && isMobile) {
      document.body.classList.add('hideScroll');
    }

    if (!this.isOpenMenu && isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  protected goToPage(url: string, removeStorage?: boolean): void {
    if (isMobile) {
      document.body.classList.remove('hideScroll');
    }

    switch (url) {
      case '/matrix':
        this.goToMatrixPage(removeStorage);

        break;
      case '/about':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to About page', {});
        this.router.navigate([url], {queryParams: {}});

        break;
      case 'https://www.gapminder.org/category/dollarstreet/':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Blog page', {});
        this.window.open(url, '_blank');

        break;
      case '/map':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Map page', {});
        this.router.navigate([url], {queryParams: {}});

        break;
      case 'https://www.gapminder.org':
        this.angulartics2GoogleAnalytics.eventTrack('Go to Gapminder.org from menu', {});
        this.window.open(url, '_blank');

        break;
      case 'https://getsatisfaction.com/gapminder':
        this.angulartics2GoogleAnalytics.eventTrack('Go to Getsatisfaction.com/gapminder from menu', {});
        this.window.open(url, '_blank');

        break;
      default:
        this.goToMatrixPage();
    }

    this.isOpenMenu = false;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }

  private goToMatrixPage(removeStorage?: boolean): void {
    if (isMobile) {
      document.body.classList.remove('hideScroll');
    }

    if (removeStorage) {
      this.window.localStorage.removeItem('quick-guide');
    }

    this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from menu', {});

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }
}
