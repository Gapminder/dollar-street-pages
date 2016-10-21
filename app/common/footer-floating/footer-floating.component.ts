import { Component, ElementRef, OnInit, OnDestroy, NgZone, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';
import { Config } from '../../app.config';

@Component({
  selector: 'float-footer',
  templateUrl: './footer-floating.template.html',
  styleUrls: ['./footer-floating.css'],
  encapsulation: ViewEncapsulation.None
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
