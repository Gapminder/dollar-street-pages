import { Directive, ElementRef, Inject, OnInit, AfterViewChecked, OnDestroy, NgZone } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';

@Directive({selector: '[footerSpace]'})
export class FooterSpaceDirective implements OnInit, AfterViewChecked, OnDestroy {
  private footerHeight: number;
  private element: HTMLElement;
  private zone: NgZone;
  private resizeSubscribe: Subscription;

  public constructor(@Inject(ElementRef) element: ElementRef,
                     @Inject(NgZone) zone: NgZone) {
    this.element = element.nativeElement;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.setFooterSpace();
        });
      });
  }

  public ngAfterViewChecked(): void {
    this.setFooterSpace();
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();
  }

  private setFooterSpace(): void {
    let footer = document.querySelector('footer') as HTMLElement;

    if (!footer) {
      return;
    }

    if (this.footerHeight === footer.offsetHeight) {
      return;
    }

    this.footerHeight = footer.offsetHeight;
    this.element.style.paddingBottom = this.footerHeight + 'px';
  }
}
