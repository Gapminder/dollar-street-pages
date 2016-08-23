import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';

let device = require('device.js')();
let isMobile = device.mobile();

let tplMobile = require('./menu-mobile.template.html');
let styleMobile = require('./menu-mobile.css');

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: isMobile ? tplMobile : tpl,
  styles: [isMobile ? styleMobile : style],
  directives: [SocialShareButtonsComponent, ROUTER_DIRECTIVES]
})

export class MainMenuComponent implements OnInit, OnDestroy {
  protected isOpenMenu: boolean = false;
  protected Angulartics2GoogleAnalytics: any;
  @Input()
  private hoverPlace: Observable<any>;
  private hoverPlaceSubscribe: Subscription;
  private element: HTMLElement;
  private router: Router;
  private activatedRoute: ActivatedRoute;
  private isMatrixComponent: boolean;
  private window: Window = window;

  public constructor(@Inject(Router) router: Router,
                     @Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any) {
    this.element = element.nativeElement;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
    this.isMatrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
  }

  public ngOnInit(): void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
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

  protected goToMatrixPage(removeStorage?: boolean): void {
    if (removeStorage) {
      this.window.localStorage.removeItem('quick-guide');
      this.Angulartics2GoogleAnalytics.eventTrack(`Go to Quick Quide from menu `);
    }

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }
    this.Angulartics2GoogleAnalytics.eventTrack(`Go to Matrix page from menu `);
    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  protected goToGapminder(): void {
    this.Angulartics2GoogleAnalytics.eventTrack(`Go to Gapminder.org from menu `);
    this.window.open('https://www.gapminder.org', '_blank');
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }
}
