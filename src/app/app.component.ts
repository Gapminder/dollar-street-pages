import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  LoaderService,
  LanguageService,
  FontDetectorService,
  GoogleAnalyticsService
} from '../common';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { SubscriptionsList } from '../interfaces';
import { forEach } from 'lodash';
import { DEBOUNCE_TIME } from '../defaultState';
declare let ga: Function;

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoader = false;
  isVisibleHeader: boolean;
  currentPage: string;
  ngSubscriptions: SubscriptionsList = {};

  @ViewChild('container')
  container: ElementRef;

  @ViewChild('headerPosition')
  headerPosition: ElementRef;

  constructor(private router: Router,
                     private languageService: LanguageService,
                     private loaderService: LoaderService,
                     private fontDetectorService: FontDetectorService,
                     private googleAnalyticsService: GoogleAnalyticsService) {
  }

  ngOnInit(): void {
    this.ngSubscriptions.loaderService = this.loaderService
      .getLoaderEvent()
      .subscribe((data: {isLoaded: boolean}) => {
        this.isLoader = data.isLoaded;
      });

    this.ngSubscriptions.documentCreated = Observable.fromEvent(document, 'DOMContentLoaded')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {

        this.fontDetectorService.detectFont();
          this.googleAnalyticsService.googleAnalyticsContent();
      });

    this.ngSubscriptions.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = '';

        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        if (activePage !== '/matrix') {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        this.isVisibleHeader = !(activePage === '/matrix' || activePage === '/family' || activePage === '/map');

        if (activePage === '/matrix') {
          this.currentPage = 'matrix';
        }

        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

    this.ngSubscriptions.scrollEvent = fromEvent(document, 'scroll')
      .subscribe(() => {
        this.setPositionHeader();
      });
  }

  ngOnDestroy(): void {
      forEach(this.ngSubscriptions, value => value.unsubscribe());
  }

  setPositionHeader(): void {
    const STACK_CLASS = 'stuck-header-position';
    const container = this.container.nativeElement

    if ( (window.scrollY < container.offsetTop) &&
      !container.classList.contains(STACK_CLASS)) {

      container.classList.add(STACK_CLASS)

    } else if ((window.scrollY >= container.offsetTop) &&
      (container.classList.contains(STACK_CLASS))) {

      container.classList.remove(STACK_CLASS)

    }
  }
}
