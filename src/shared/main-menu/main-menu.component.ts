import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  AfterViewInit,
  ViewChild, Output
} from '@angular/core';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import {
  DrawDividersInterface,
  LocalStorageService,
  BrowserDetectionService,
  Angulartics2GoogleTagManager,
  LanguageService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppState, AppStates, MatrixState, StreetSettingsState, SubscriptionsList } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { DEBOUNCE_TIME } from '../../defaultState';
import { get, forEach } from 'lodash';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.template.html',
  styleUrls: ['./main-menu.component.css', './main-menu.component.mobile.css']
})
export class MainMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialShareContent')
   socialShareContent: ElementRef;

  analyticLocation = 'menu';
  element: HTMLElement;
  window: Window = window;
  isOpenMenu: boolean = false;
  streetData: DrawDividersInterface;
  getTranslationSubscribe: Subscription;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  socialShareContentElement: HTMLElement;
  shareTranslation: string;
  additionUrlParams: string;
  pinMode = false;
  embedMode = false;
  ngSubscriptions: SubscriptionsList = {};
  isMatrixPage = false;

  constructor(elementRef: ElementRef,
                     private router: Router,
                     private languageService: LanguageService,
                     private localStorageService: LocalStorageService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
                     private urlParametersService: UrlParametersService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;

  }

  ngAfterViewInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('SHARE').subscribe((trans: any) => {
      this.shareTranslation = trans;

      this.processShareTranslation();
    });
  }

  ngOnInit(): void {
    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isTablet = this.browserDetectionService.isTablet();

    this.ngSubscriptions.streetSettings = this.store
      .select((appStates: AppStates) => appStates.streetSettings)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: StreetSettingsState) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

    this.ngSubscriptions.appState = this.store
      .select((appStates: AppStates) => appStates.app)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: AppState) => {
      if (data && data.query) {
        this.additionUrlParams = data.query;
      }
    });

    this.ngSubscriptions.matrixState = this.store
      .select((appStates: AppStates) => appStates.matrix)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((matrix: MatrixState) => {
        this.pinMode = get(matrix, 'pinMode', false);
        this.embedMode = get(matrix, 'embedMode', false);
      });

    this.ngSubscriptions.routerEvents = this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.isMatrixPage = this.urlParametersService.isCurrentPage('matrix');
      }
    });
  }

  processShareTranslation(): void {
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

  ngOnDestroy(): void {

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }

    forEach(this.ngSubscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    })
  }

  openMenu(isOpenMenu: boolean): void {
    this.isOpenMenu = !isOpenMenu;

    if (this.isOpenMenu && this.isMobile || this.isTablet) {
      document.body.classList.add('hideScroll');
    }

    if (!this.isOpenMenu && this.isMobile || this.isTablet) {
      document.body.classList.remove('hideScroll');
    }
  }

  goToPage(url: string, saveUrlData = false): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
    const urlWithData = `${url}${saveUrlData ? this.additionUrlParams : ''}`;
    switch (url) {
      case '/matrix':
        this.goToMatrixPage();
        break;

      case '/about':
        this.angulartics2GoogleTagManager.eventTrack('From menu to About page', {});
        this.router.navigate([url]);
        break;

      case 'https://www.gapminder.org/category/dollarstreet/':
        this.angulartics2GoogleTagManager.eventTrack('From menu to Blog page', {});
        this.window.open(url, '_blank');
        break;

      case '/donate':
        this.angulartics2GoogleTagManager.eventTrack('From menu to Donate page', {});
        this.router.navigate([url]);
        break;

      case '/map':
        this.angulartics2GoogleTagManager.eventTrack('From menu to Map page', {});
        this.router.navigate([url]);
        break;

      case 'https://www.gapminder.org':
        this.angulartics2GoogleTagManager.eventTrack('Go to Gapminder.org from menu', {});
        this.window.open(url, '_blank');
        break;

      case 'https://getsatisfaction.com/gapminder':
        this.angulartics2GoogleTagManager.eventTrack('Go to Getsatisfaction.com/gapminder from menu', {});
        this.window.open(url, '_blank');
        break;

      default:
        this.goToMatrixPage();
    }

    this.isOpenMenu = false;
  }

  @HostListener('document:click', ['$event'])
  isOutsideMainMenuClick(event: any): void {
    if (!this.element.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }

  openQuickGuide(): void {
    this.localStorageService.removeItem('quick-guide');

    document.body.scrollTop = 0;

    this.isOpenMenu = false;

    this.store.dispatch(new MatrixActions.OpenQuickGuide(true));

    this.goToMatrixPage();
  }

  goToMatrixPage(): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }

    this.router.navigate(['/matrix']);

    this.angulartics2GoogleTagManager.eventTrack('Go to Matrix page from menu', {});
  }

  SetPinMode(): void {
    if (!this.pinMode && !this.embedMode) {
      this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
      this.store.dispatch(new MatrixActions.SetPinMode(true));
      this.openMenu(this.isOpenMenu);
    }
  }
}
