import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscriber } from 'rxjs/Rx';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';
import { SocialFollowButtonsComponent } from '../social-follow-buttons/social-follow-buttons.component.ts';

import { Angulartics2On } from 'angulartics2';

let tpl = require('./footer.template.html');
let style = require('./footer.css');

@Component({
  selector: 'footer',
  template: tpl,
  styles: [style],
  directives: [ROUTER_DIRECTIVES, SocialShareButtonsComponent, SocialFollowButtonsComponent, Angulartics2On],
  encapsulation: ViewEncapsulation.None
})

export class FooterComponent implements OnInit, OnDestroy {
  protected footerData: any = {};
  private footerService: any;
  private footerServiceSubscribe: Subscriber<any>;

  public constructor(@Inject('FooterService') footerService: any) {
    this.footerService = footerService;
  }

  public ngOnInit(): any {
    this.footerServiceSubscribe = this.footerService.getFooter()
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);
          return;
        }

        this.footerData = val.data;
      });
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


  public ngOnDestroy(): void {
    this.footerServiceSubscribe.unsubscribe();
  }
}
