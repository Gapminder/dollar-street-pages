import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import {
  DrawDividersInterface,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleAnalytics,
  LanguageService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStore } from '../../interfaces';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.template.html',
  styleUrls: ['./main-menu.component.css', './main-menu.component.mobile.css']
})
export class MainMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialShareContent')
  public socialShareContent: ElementRef;

  @Input()
  public hoverPlace: Observable<any>;
  @Output()
  public selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  public element: HTMLElement;
  public window: Window = window;
  public isMatrixComponent: boolean;
  public isOpenMenu: boolean = false;
  public streetData: DrawDividersInterface;
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public hoverPlaceSubscribe: Subscription;
  public routerEventsSubscribe: Subscription;
  public getTranslationSubscribe: Subscription;
  public localStorageService: LocalStorageService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public socialShareContentElement: HTMLElement;
  public languageService: LanguageService;
  public shareTranslation: string;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public languages: any;

  public constructor(router: Router,
                     element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     languageService: LanguageService,
                     localStorageService: LocalStorageService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     store: Store<AppStore>) {
    this.element = element.nativeElement;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.device = browserDetectionService;
    this.localStorageService = localStorageService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
  }

  public ngAfterViewInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('SHARE').subscribe((trans: any) => {
      this.shareTranslation = trans;

      this.processShareTranslation();
    });
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

    this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace
      .subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });

    this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
    });

    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
      if (this.isOpenMenu) {
        this.isOpenMenu = false;
      }
    });
  }

  public processShareTranslation(): void {
    if (!this.shareTranslation || !this.socialShareContent) {
      return;
    }

    this.socialShareContentElement = this.socialShareContent.nativeElement;

    if (this.socialShareContentElement) {
      this.socialShareContentElement.classList.remove('long-text');

      if (this.shareTranslation.length > 6) {
        this.socialShareContentElement.classList.add('long-text');
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.routerEventsSubscribe) {
      this.routerEventsSubscribe.unsubscribe();
    }

    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
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

      case '/donate':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Donate page', {});
        this.router.navigate([url], { queryParams: {} });
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
      lang: this.languageService.currentLanguage
    };

    if (!this.isDesktop) {
      queryParams.zoom = 3;
    }

    if (this.isMatrixComponent) {
      // this.selectedFilter.emit({url: this.objToQuery(queryParams)});
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
