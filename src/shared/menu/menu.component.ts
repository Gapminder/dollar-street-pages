import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  StreetSettingsService,
  DrawDividersInterface,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleAnalytics
} from '../../common';
import { LanguageService } from '../language-selector/language.service';

@Component({
  selector: 'main-menu',
  templateUrl: './menu.template.html',
  styleUrls: ['menu.component.css', 'menu.component.mobile.css']
})

export class MainMenuComponent implements OnInit, OnDestroy {
  @Input('hoverPlace') public hoverPlace: Observable<any>;
  @Output('selectedFilter') public selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  public element: HTMLElement;
  public window: Window = window;
  public isMatrixComponent: boolean;
  public isOpenMenu: boolean = false;
  public streetData: DrawDividersInterface;

  public router: Router;
  public activatedRoute: ActivatedRoute;
  public hoverPlaceSubscribe: Subscription;
  public routerEventsSubscribe: Subscription;
  public streetServiceSubscribe: Subscription;
  public translateOnLangChangeSubscribe: Subscription;
  public localStorageService: LocalStorageService;
  public streetSettingsService: StreetSettingsService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public translate: TranslateService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public imgContent: HTMLElement;
  private languageService: LanguageService;

  public constructor(router: Router,
                     element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     languageService: LanguageService,
                     localStorageService: LocalStorageService,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     translate: TranslateService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.element = element.nativeElement;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.translate = translate;
    this.device = browserDetectionService;
    this.localStorageService = localStorageService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();

    let activatedRoutePath = this.activatedRoute.snapshot.url.shift();

    if (activatedRoutePath) {
      this.isMatrixComponent = activatedRoutePath.path === 'matrix';
    } else {
      this.routerEventsSubscribe = this.router
        .events
        .subscribe((event: any) => {
          if (event instanceof NavigationEnd) {
            let activePage: string = event
              .urlAfterRedirects
              .split('?')
              .shift();

            this.isMatrixComponent = activePage === '/matrix';
          }
        });
    }

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace
        .subscribe(() => {
          if (this.isOpenMenu) {
            this.isOpenMenu = false;
          }
        });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange
      .subscribe((event: any) => {
        let shareWordTranslation: string = event.translations.SHARE;

        this.openMenu(true);

        if (this.isDesktop) {
          this.imgContent = this.element.querySelector('.social-share-content') as HTMLElement;
          this.imgContent.classList.remove('long-text');

          if (shareWordTranslation.length > 6) {
            this.imgContent.classList.add('long-text');
          }
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (this.routerEventsSubscribe) {
      this.routerEventsSubscribe.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  public openMenu(isOpenMenu: boolean): void {
    this.isOpenMenu = !isOpenMenu;

    if (this.isOpenMenu && this.isMobile) {
      document.body.classList.add('hideScroll');
    }

    if (!this.isOpenMenu && this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  public goToPage(url: string, removeStorage?: boolean): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }

    switch (url) {
      case '/matrix':
        this.goToMatrixPage(removeStorage);

        break;
      case '/about':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to About page', {});
        this.router.navigate([url], {queryParams: {}});

        break;
      case 'https://www.gapminder.org/category/dollarstreet/':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Blog page', {});
        this.window.open(url, '_blank');

        break;
      case '/map':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Map page', {});
        this.router.navigate([url], {queryParams: {thing: 'Families'}});

        break;
      case 'https://www.gapminder.org':
        this.angulartics2GoogleAnalytics.eventTrack('Go to Gapminder.org from menu', {});
        this.window.open(url, '_blank');

        break;
      case 'https://getsatisfaction.com/gapminder':
        this.angulartics2GoogleAnalytics.eventTrack('Go to Getsatisfaction.com/gapminder from menu', {});
        this.window.open(url, '_blank');

        break;
      default:
        this.goToMatrixPage();
    }

    this.isOpenMenu = false;
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }

  public goToMatrixPage(removeStorage?: boolean): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }

    if (removeStorage) {
      this.localStorageService.removeItem('quick-guide');
    }

    let queryParams = {
      thing: 'Families',
      countries: 'World',
      regions: 'World',
      zoom: 4,
      row: 1,
      lowIncome: this.streetData.poor,
      highIncome: this.streetData.rich,
      language: this.languageService.currentLanguage
    };

    if (!this.isDesktop) {
      queryParams.zoom = 3;
    }

    if (this.isMatrixComponent) {
      this.selectedFilter.emit({url: this.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from menu', {});
  }

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
