import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  StreetSettingsService,
  DrawDividersInterface,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleAnalytics
} from '../../common';

@Component({
  selector: 'main-menu',
  templateUrl: './menu.template.html',
  styleUrls: ['menu.component.css', 'menu.component.mobile.css']
})

export class MainMenuComponent implements OnInit, OnDestroy {
  @Input('hoverPlace') private hoverPlace: Observable<any>;
  @Output('selectedFilter') private selectedFilter: EventEmitter<any> = new EventEmitter<any>();

  private element: HTMLElement;
  private window: Window = window;
  private isMatrixComponent: boolean;
  private isOpenMenu: boolean = false;
  private streetData: DrawDividersInterface;

  private router: Router;
  private activatedRoute: ActivatedRoute;
  private hoverPlaceSubscribe: Subscription;
  private routerEventsSubscribe: Subscription;
  private streetServiceSubscribe: Subscription;
  private localStorageService: LocalStorageService;
  private streetSettingsService: StreetSettingsService;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private device: BrowserDetectionService;
  private isDesktop: boolean;
  private isMobile: boolean;

  public constructor(router: Router,
                     element: ElementRef,
                     activatedRoute: ActivatedRoute,
                     localStorageService: LocalStorageService,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.element = element.nativeElement;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.device = browserDetectionService;
    this.localStorageService = localStorageService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
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
  }

  public ngOnDestroy(): void {
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

  protected openMenu(isOpenMenu: boolean): void {
    this.isOpenMenu = !isOpenMenu;

    if (this.isOpenMenu && this.isMobile) {
      document.body.classList.add('hideScroll');
    }

    if (!this.isOpenMenu && this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  protected goToPage(url: string, removeStorage?: boolean): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }

    switch (url) {
      case '/matrix':
        this.goToMatrixPage(removeStorage);

        break;
      case '/about':
        // this.angulartics2GoogleAnalytics.eventTrack('From menu to About page', {});
        this.router.navigate([url], {queryParams: {}});

        break;
      case 'https://www.gapminder.org/category/dollarstreet/':
        // this.angulartics2GoogleAnalytics.eventTrack('From menu to Blog page', {});
        this.window.open(url, '_blank');

        break;
      case '/map':
        // this.angulartics2GoogleAnalytics.eventTrack('From menu to Map page', {});
        this.router.navigate([url], {queryParams: {thing: 'Families'}});

        break;
      case 'https://www.gapminder.org':
        // this.angulartics2GoogleAnalytics.eventTrack('Go to Gapminder.org from menu', {});
        this.window.open(url, '_blank');

        break;
      case 'https://getsatisfaction.com/gapminder':
        // this.angulartics2GoogleAnalytics.eventTrack('Go to Getsatisfaction.com/gapminder from menu', {});
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

  private goToMatrixPage(removeStorage?: boolean): void {
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
      highIncome: this.streetData.rich
    };

    if (!this.isDesktop) {
      queryParams.zoom = 3;
    }

    if (this.isMatrixComponent) {
      this.selectedFilter.emit({url: this.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    // this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from menu', {});
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
