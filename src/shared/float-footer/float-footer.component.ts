import { Component, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Config } from '../../app.config';
import { BrowserDetectionService } from '../../common';

@Component({
  selector: 'float-footer',
  templateUrl: './float-footer.component.html',
  styleUrls: ['./float-footer.component.css']
})

export class FloatFooterComponent implements OnInit, OnDestroy {
  public zone: NgZone;
  public element: HTMLElement;
  public scrollSubscribe: Subscription;
  public device: BrowserDetectionService;
  public isDesktop: boolean;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     browserDetectionService: BrowserDetectionService) {
    this.zone = zone;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
  }

  public ngOnInit(): any {
    this.isDesktop = this.device.isDesktop();
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

    Config.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };
}
