import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import {
  BrowserDetectionService,
  UtilsService
} from '../../common';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';

@Component({
  selector: 'float-footer',
  templateUrl: './float-footer.component.html',
  styleUrls: ['./float-footer.component.css']
})
export class FloatFooterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('floatFooterContainer')
  public floatFooterContainer: ElementRef;

  public element: HTMLElement;
  public scrollSubscribe: Subscription;
  public isDesktop: boolean;

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private browserDetectionService: BrowserDetectionService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.scrollSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        let floatFooterContainerElement: HTMLElement = this.floatFooterContainer.nativeElement;

        this.zone.run(() => {
          floatFooterContainerElement.classList.add('show-float-footer');

          if (!scrollTop) {
            floatFooterContainerElement.classList.remove('show-float-footer');
          }
        });
      });
  }

  public ngOnInit(): any {
    this.isDesktop = this.browserDetectionService.isDesktop();
  }

  public ngOnDestroy(): void {
    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }
  }

  public SetPinMode(): void {
    this.store.dispatch(new MatrixActions.SetPinMode(true));
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };
}
