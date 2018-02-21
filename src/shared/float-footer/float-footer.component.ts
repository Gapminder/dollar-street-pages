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
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  public routerEventsSubscription: Subscription;
  public storeSubscription: Subscription
  public isMatrixPage: boolean;
  public pinMode: boolean;
  public embedMode: boolean;
  showEmbeded = false; //TODO: hided embed features for prod 20.02.18

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private browserDetectionService: BrowserDetectionService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private router: Router,
                     private activatedRoute: ActivatedRoute) {
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

    this.routerEventsSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isMatrixPage = this.isCurrentPage('matrix');
      }
    });

    this.storeSubscription = this.store.select('matrix').subscribe(matrix => {
      this.pinMode = matrix.pinMode;
      this.embedMode = matrix.embedMode;
    });
  }

  public ngOnDestroy(): void {
    if (this.scrollSubscribe) {
      this.scrollSubscribe.unsubscribe();
    }

    this.routerEventsSubscription.unsubscribe();
    this.storeSubscription.unsubscribe();
  }

  public isCurrentPage(name: string): boolean {
    let shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
        return true;
      }
    }

    return false;
  }

  public SetPinMode(): void {
    if (!this.pinMode && !this.embedMode) {
      this.store.dispatch(new MatrixActions.SetPinMode(true));
    }
  }

  public scrollTop(e: MouseEvent): void {
    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };
}
