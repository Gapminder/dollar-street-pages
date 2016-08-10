import { Component, ElementRef, Inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./footer-floating.template.html');
let style = require('./footer-floating.css');

@Component({
  selector: 'float-footer',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtonsComponent]
})

export class FloatFooterComponent implements OnInit, OnDestroy {
  protected familyShortInfoPosition: number;
  private zone: NgZone;
  private element: HTMLElement;
  private scrollSubscribe: Subscription;

  public constructor(@Inject(ElementRef) element: ElementRef,
                     @Inject(NgZone) zone: NgZone) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): any {
    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        this.zone.run(() => {
          let floatFooterContainer = this.element.querySelector('.float-footer-container') as HTMLElement;

          floatFooterContainer.classList.add('show-float-footer');

          if (!scrollTop) {
            floatFooterContainer.classList.remove('show-float-footer');
          }
        });
      });
  }

  public ngOnDestroy(): void {
    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();
    this.animateScroll('scrollBackToTop', 20, 1000);
  };

  private animateScroll(id: string, inc: number, duration: number): any {
    const elem = document.getElementById(id);
    const startScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const endScroll = elem.offsetTop;
    const step = (endScroll - startScroll) / duration * inc;
    window.requestAnimationFrame(this.goToScroll(step, duration, inc));
  }

  private goToScroll(step: number, duration: number, inc: number): any {
    return () => {
      const currentDuration = duration - inc;

      this.incScrollTop(step);

      if (currentDuration < inc) {
        return;
      }

      window.requestAnimationFrame(this.goToScroll(step, currentDuration, inc));
    };
  }

  private incScrollTop(step: number): void {
    if (document.body.scrollTop) {
      document.body.scrollTop += step;
    } else {
      document.documentElement.scrollTop += step;
    }
  }
}
