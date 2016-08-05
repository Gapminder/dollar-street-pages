import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Rx';
import { Angulartics2On } from 'angulartics2';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [Angulartics2On, SocialShareButtonsComponent, ROUTER_DIRECTIVES]
})

export class MainMenuComponent implements OnInit, OnDestroy {
  protected isOpenMenu:boolean = false;
  @Input()
  private hoverPlace:Observable<any>;
  private hoverPlaceSubscribe:Subscriber;
  private element:ElementRef;
  private router:Router;
  private activatedRoute:ActivatedRoute;
  private isMatrixComponent:boolean;
  private window:Window = window;
  private angulartics2GoogleAnalytics:any;

  public constructor(@Inject(Router) router:Router,
                     @Inject(ActivatedRoute) activatedRoute:ActivatedRoute,
                     @Inject(ElementRef) element:ElementRef,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics:any) {
    this.element = element;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.isMatrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
  }

  public ngOnInit():void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });
  }

  public ngOnDestroy():void {
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }
  }

  protected goToMatrixPage(removeStorage?:boolean):void {
    this.angulartics2GoogleAnalytics.eventTrack('Matrix page');

    if (removeStorage) {
      this.window.localStorage.removeItem('quick-guide');
    }

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  protected goToGapminder():void {
    this.window.open('https://www.gapminder.org', '_blank');
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event:Event):void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }
}
