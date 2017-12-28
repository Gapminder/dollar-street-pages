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
import {AppState, AppStates, StreetSettingsState} from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.template.html',
  styleUrls: ['./main-menu.component.css', './main-menu.component.mobile.css']
})
export class MainMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('socialShareContent')
  public socialShareContent: ElementRef;

  public element: HTMLElement;
  public window: Window = window;
  public isMatrixPage: boolean;
  public isOpenMenu: boolean = false;
  public streetData: DrawDividersInterface;
  public getTranslationSubscribe: Subscription;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public socialShareContentElement: HTMLElement;
  public shareTranslation: string;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;
  public appState: Observable<AppState>;
  public appStateSubscription: Subscription;
  public languagesListSubscription: Subscription;
  public additionUrlParams: string;

  public constructor(elementRef: ElementRef,
                     private router: Router,
                     private languageService: LanguageService,
                     private localStorageService: LocalStorageService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.appState = this.store.select((appStates: AppStates) => appStates.app);
  }

  public ngAfterViewInit(): void {
    this.getTranslationSubscribe = this.languageService.getTranslation('SHARE').subscribe((trans: any) => {
      this.shareTranslation = trans;

      this.processShareTranslation();
    });
  }

  public ngOnInit(): void {
    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isTablet = this.browserDetectionService.isTablet();

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: AppState) => {
      if (data && data.query) {
        this.additionUrlParams = data.query;
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
    if (this.languagesListSubscription) {
      this.languagesListSubscription.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
  }

  public openMenu(isOpenMenu: boolean): void {
    this.isOpenMenu = !isOpenMenu;

    if (this.isOpenMenu && this.isMobile || this.isTablet) {
      document.body.classList.add('hideScroll');
    }

    if (!this.isOpenMenu && this.isMobile || this.isTablet) {
      document.body.classList.remove('hideScroll');
    }
  }

  public goToPage(url: string, saveUrlData = false): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
    }
    const urlWithData = `${url}${saveUrlData ? this.additionUrlParams : ''}`;
    switch (url) {
      case '/matrix':
        this.goToMatrixPage();
        break;

      case '/about':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to About page', {});
        this.router.navigate([url], { queryParamsHandling: saveUrlData ? 'merge' : null });
        break;

      case 'https://www.gapminder.org/category/dollarstreet/':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Blog page', {});
        this.window.open(url, '_blank');
        break;

      case '/donate':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Donate page', {});
        this.router.navigate([url], { queryParamsHandling: saveUrlData ? 'merge' : null });
        break;

      case '/map':
        this.angulartics2GoogleAnalytics.eventTrack('From menu to Map page', {});
        this.router.navigate([url], { queryParamsHandling: saveUrlData ? 'merge' : null });
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

  public openQuickGuide(): void {
    this.localStorageService.removeItem('quick-guide');

    document.body.scrollTop = 0;

    this.isOpenMenu = false;

    this.store.dispatch(new MatrixActions.OpenQuickGuide(true));

    this.goToMatrixPage();
  }

  public goToMatrixPage(): void {
    if (this.isMobile) {
      document.body.classList.remove('hideScroll');
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

    this.router.navigate(['/matrix'], {queryParams: queryParams});

    this.angulartics2GoogleAnalytics.eventTrack('Go to Matrix page from menu', {});
  }
}
