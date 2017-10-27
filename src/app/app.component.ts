import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  LoaderService,
  LanguageService,
  FontDetectorService,
  GoogleAnalyticsService
} from '../common';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;
  public documentCreatedSubscribe: Subscription;
  public currentPage: string;

  public constructor(private router: Router,
                     private languageService: LanguageService,
                     private loaderService: LoaderService,
                     private fontDetectorService: FontDetectorService,
                     private googleAnalyticsService: GoogleAnalyticsService) {
  }

  public ngOnInit(): void {
    this.loaderServiceSubscribe = this.loaderService
      .getLoaderEvent()
      .subscribe((data: {isLoaded: boolean}) => {
        this.isLoader = data.isLoaded;
      });

    this.documentCreatedSubscribe = Observable.fromEvent(document, 'DOMContentLoaded')
      .subscribe(() => {
          this.fontDetectorService.detectFont();
          this.googleAnalyticsService.googleAnalyticsContent();
      });

    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
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

        //this.languageService.updateLangInUrl();
      }
    });
  }

  public ngOnDestroy(): void {
      if (this.routerEventsSubscribe) {
          this.routerEventsSubscribe.unsubscribe();
      }

      if (this.loaderServiceSubscribe) {
          this.loaderServiceSubscribe.unsubscribe();
      }

      if (this.documentCreatedSubscribe) {
          this.documentCreatedSubscribe.unsubscribe();
      }
  }
}
