import { Component, ViewEncapsulation, ElementRef, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';
import { Angulartics2On } from 'angulartics2';

let tpl = require('./footer-floating.template.html');
let style = require('./footer-floating.css');

@Component({
  selector: 'floatfooter',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, SocialShareButtonsComponent, Angulartics2On],
  encapsulation: ViewEncapsulation.None
})

export class FloatFooterComponent implements OnInit, OnDestroy {
  protected footerData:any = {};

  private zone:NgZone;
  private element:HTMLElement;
  private scrollSubscribe:any;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(NgZone) zone:NgZone) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit():any {
    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        this.zone.run(() => {
          let floatFooterContainer = this.element.querySelector('.floatfooter') as HTMLElement;

          floatFooterContainer.classList.add('show-float-footer');

          if (!scrollTop) {
            floatFooterContainer.classList.remove('show-float-footer');
          }
        });
      });
  }

  public ngOnDestroy():void {
    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  public scrollTop(e:MouseEvent):void {
    e.preventDefault();
    this.animateScroll('scrollBackToTop', 20, 1000);
  };

  private animateScroll(id:string, inc:number, duration:number):any {
    const elem = document.getElementById(id);
    const startScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;
    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private goToScroll(step:number, duration:number, inc:number):any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }
      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private incScrollTop(step:number):void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
