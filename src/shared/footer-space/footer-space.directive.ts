import 'rxjs/add/operator/debounceTime';

import { Directive, ElementRef, OnInit, AfterViewChecked, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DEBOUNCE_TIME } from "../../defaultState";

@Directive({selector: '[footerSpace]'})
export class FooterSpaceDirective implements OnInit, AfterViewChecked, OnDestroy {
  public footerHeight: number;
  public element: HTMLElement;
  public resizeSubscribe: Subscription;

  public constructor(elementRef: ElementRef,
                     private zone: NgZone) {
    this.element = elementRef.nativeElement;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
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
    //this.element.style.paddingBottom = this.footerHeight + 'px';
  }
}
