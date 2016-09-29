import { Component, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';
import { Config } from '../../app.config';

let tpl = require('./footer-floating.template.html');
let style = require('./footer-floating.css');

@Component({
  selector: 'float-footer',
  template: tpl,
  styles: [style]
})

export class FloatFooterComponent implements OnInit, OnDestroy {
  private zone: NgZone;
  private element: HTMLElement;
  private scrollSubscribe: Subscription;

  public constructor(zone: NgZone,
                     element: ElementRef) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): any {
    let floatFooterContainer = this.element.querySelector('.float-footer-container') as HTMLElement;

    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        this.zone.run(() => {
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

    Config.animateScroll('scrollBackToTop', 20, 1000);
  };
}
