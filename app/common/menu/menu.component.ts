import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';
import { Subscriber } from 'rxjs/Rx';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtonsComponent, ROUTER_DIRECTIVES]
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

  public constructor(@Inject(Router) router:Router,
                     @Inject(ActivatedRoute) activatedRoute:ActivatedRoute,
                     @Inject(ElementRef) element:ElementRef) {
    this.element = element;
    this.router = router;
    this.activatedRoute = activatedRoute;
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

  protected goToMatrixPage():void {
    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  protected switchOnOnboardingFromMenu():void {
    this.window.localStorage.removeItem('onboarded');

    if (this.isMatrixComponent) {
      this.window.location.href = this.window.location.origin;

      return;
    }

    this.router.navigate(['/matrix'], {queryParams: {}});
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event:Event):void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }
}
