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
  public window: Window = window;
  public navigator: any = navigator;
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public router: Router;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;
  public documentCreatedSubscribe: Subscription;
  public languageService: LanguageService;
  public loaderService: LoaderService;
  public googleAnalyticsService: GoogleAnalyticsService;
  public fontDetectorService: FontDetectorService;

  public constructor(router: Router,
                     languageService: LanguageService,
                     loaderService: LoaderService,
                     fontDetectorService: FontDetectorService,
                     googleAnalyticsService: GoogleAnalyticsService) {
    this.router = router;
    this.loaderService = loaderService;
    this.languageService = languageService;
    this.googleAnalyticsService = googleAnalyticsService;
    this.fontDetectorService = fontDetectorService;
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
        let activePage: string = event
          .urlAfterRedirects
          .split('?')
          .shift();

        if (activePage !== '/matrix') {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        this.isVisibleHeader = !(activePage === '/matrix' || activePage === '/family' || activePage === '/map');

        this.languageService.updateLangInUrl();
      }
    });
  }

  public ngOnDestroy(): void {
    this.routerEventsSubscribe.unsubscribe();
    this.loaderServiceSubscribe.unsubscribe();
    this.documentCreatedSubscribe.unsubscribe();
  }
}
