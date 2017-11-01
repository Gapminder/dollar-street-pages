import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
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
  GoogleAnalyticsService,
  UrlChangeService,
  UtilsService
} from '../common';

@Component({
  selector: 'consumer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public query: string;
  public isLoader: boolean = false;
  public isVisibleHeader: boolean;
  public routerEventsSubscribe: Subscription;
  public loaderServiceSubscribe: Subscription;
  public documentCreatedSubscribe: Subscription;
  public currentPage: string;
  public contentLoadedSubscription: Subscription;
  public hostClickSubscription: Subscription;
  public waitTime: number = 5 * 1;
  public refreshTime: number = 30;
  public refreshTimer: number;
  public waitingTimer: number;
  public refreshDialog: any;
  public waitingInterval: any;
  public refreshInterval: any;
  public dialogTrans: any;
  public dialogTransEn: any = {
    head: 'Hey, you seem inactive!',
    text: 'We will reset Dollar Street to the home page in',
    sec: 'seconds.',
    resetBtn: "Don't reset, stay on this page",
    homeBtn: 'Go to the home page now'
  };
  public dialogTransSv: any = {
    head: 'Hej, du verkar inaktiv!',
    text: 'Vi kommer att återställa Dollar Street till hemsidan på',
    sec: 'sekunder.',
    resetBtn: "Återställ inte, stanna på den här sidan",
    homeBtn: 'Gå till hemsidan nu'
  };
  public queryParams: any = {
    thing: 'Families',
    countries: 'World',
    regions: 'World',
    zoom: 4,
    row: 1
  };

  public constructor(private router: Router,
                     private languageService: LanguageService,
                     private loaderService: LoaderService,
                     private fontDetectorService: FontDetectorService,
                     private googleAnalyticsService: GoogleAnalyticsService,
                     private urlChangeService: UrlChangeService,
                     private utilsService: UtilsService) {
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

        this.languageService.updateLangInUrl();
      }
    });

    if (this.languageService.currentLanguage === 'en') {
      this.dialogTrans = this.dialogTransEn;
    } else {
      this.dialogTrans = this.dialogTransSv;
    }

    this.contentLoadedSubscription = fromEvent(document, 'DOMContentLoaded').subscribe(() => {
      this.refreshDialog = document.getElementById('refreshDialog') as any;
      this.startWaiting();

      document.getElementById('dontReset').onclick = () => {
        this.resetWaiting();
      };

      document.getElementById('gotoHome').onclick = () => {
        this.urlChangeService.replaceState('/matrix', this.utilsService.objToQuery(this.queryParams));
        this.router.navigate(['/matrix'], {queryParams: this.queryParams});
        this.languageService.changeLanguage(this.languageService.defaultLanguage);
      };
    });

    this.hostClickSubscription = fromEvent(document, 'click').subscribe(() => {
      this.resetWaiting();
    });
  }

  public resetWaiting() {
    clearInterval(this.waitingInterval);
    clearInterval(this.refreshInterval);
    this.startWaiting();
  }

  public startWaiting() {
    if (this.refreshDialog.getAttribute('open') === '') {
      this.refreshDialog.close();
    }

    clearInterval(this.waitingInterval);

    this.refreshTimer = parseInt(this.refreshTime.toString());
    this.waitingTimer = this.waitTime;

    this.waitingInterval = setInterval(() => {
      this.waitingTimer -= 1;

      if (this.waitingTimer === 0) {
        this.waitingTimer = this.waitTime;
        clearInterval(this.waitingInterval);

        let urlParams = this.utilsService.parseUrl(location.href);

        let region;
        let country;

        if (urlParams.regions && urlParams.countries) {
          region = urlParams.regions[0];
          country = urlParams.countries[0];
        }

        const lang = urlParams.lang;
        const thing = urlParams.thing;

        if (window.scrollY !== 0 ||
          region !== 'World' ||
          country !== 'World' ||
          lang !== 'sv-SE' ||
          thing !== 'Families'
        ) {
          this.startTiming();
        } else {
          this.startWaiting();
        }
      }
    }, 1000);
  }

  public startTiming() {
    if (this.refreshDialog.getAttribute('open') !== '') {
      this.refreshDialog.showModal();
    }

    clearInterval(this.refreshInterval);

    this.refreshInterval = setInterval(() => {
      this.refreshTimer -= 1;

      if (this.refreshTimer === 0) {
        this.refreshDialog.close();
        clearInterval(this.refreshInterval);

        this.urlChangeService.replaceState('/matrix', this.utilsService.objToQuery(this.queryParams));
        this.router.navigate(['/matrix'], {queryParams: this.queryParams});
        this.languageService.changeLanguage(this.languageService.defaultLanguage);

        this.startWaiting();
      }
    }, 1000);
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

      this.contentLoadedSubscription.unsubscribe();
      this.hostClickSubscription.unsubscribe();
  }
}
