import { fromEvent } from 'rxjs/observable/fromEvent';
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
import { AppStates, SubscriptionsList } from '../../interfaces';
import {
  BrowserDetectionService,
  UtilsService
} from '../../common';
import { Subscription } from 'rxjs/Subscription';
import { debounce } from 'rxjs/operator/debounce';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { forEach } from 'lodash';

const CLASS_TO_SHOW_FOOTER = 'show-float-footer';


@Component({
  selector: 'float-footer',
  templateUrl: './float-footer.component.html',
  styleUrls: ['./float-footer.component.css']
})
export class FloatFooterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('floatFooterContainer')
  floatFooterContainer: ElementRef;

  analyticLocation = 'footer';
  element: HTMLElement;
  scrollSubscribe: Subscription;
  isDesktop: boolean;

  ngSubscriptions: SubscriptionsList = {};
  isMatrixPage: boolean;
  pinMode: boolean;
  embedMode: boolean;
  showEmbeded = false; //TODO: hided embed features for prod 20.02.18

  constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private browserDetectionService: BrowserDetectionService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private router: Router,
                     private activatedRoute: ActivatedRoute) {
    this.element = elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.setPositionByScroll();
    this.ngSubscriptions.scroll = fromEvent(document, 'scroll')
      .subscribe(() => {
        this.setPositionByScroll();
      });
    this.ngSubscriptions.resize = fromEvent(window, 'resize')
      .subscribe(() => {
          this.setPositionByScroll();
      });
  }

  ngOnInit(): void {
    this.isDesktop = this.browserDetectionService.isDesktop();

    this.ngSubscriptions.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isMatrixPage = this.isCurrentPage('matrix');
      }
    });

    this.ngSubscriptions.store = this.store.select('matrix').subscribe(matrix => {
      this.pinMode = matrix.pinMode;
      this.embedMode = matrix.embedMode;
    });
  }

  ngOnDestroy(): void {
    forEach(this.ngSubscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    })
  }

  setPositionByScroll(): void {
    const floatFooterContainerElement: HTMLElement = this.floatFooterContainer.nativeElement;
    const isPageWithScroll = document.body.clientHeight > window.innerHeight;
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const isScrolled = !!scrollTop;

    if (!isPageWithScroll &&
      !floatFooterContainerElement.classList.contains(CLASS_TO_SHOW_FOOTER)) {

        floatFooterContainerElement.classList.add('show-float-footer');
    };

    if (isPageWithScroll && isScrolled){
        floatFooterContainerElement.classList.add('show-float-footer');
    }

    if (isPageWithScroll && !isScrolled) {
      floatFooterContainerElement.classList.remove('show-float-footer');
    }
  }

  isCurrentPage(name: string): boolean {
    let shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
        return true;
      }
    }

    return false;
  }

  scrollTop(e: MouseEvent): void {
    this.utilsService.animateScroll('scrollBackToTop', 100, 1000, this.isDesktop);
  };
}
