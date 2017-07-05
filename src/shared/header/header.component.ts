import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Renderer
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStore
} from '../../interfaces';
import { AppActions } from '../../app/app.actions';
import { ThingsFilterActions } from '../things-filter/things-filter.actions';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { CountriesFilterActions } from '../countries-filter/countries-filter.actions';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';
import {
  MathService,
  Angulartics2GoogleAnalytics,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService,
  TitleHeaderService
} from '../../common';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild(ThingsFilterComponent)
  public thingsFilterComponent: ThingsFilterComponent;
  @ViewChild(CountriesFilterComponent)
  public countriesFilterComponent: CountriesFilterComponent;
  @ViewChild('filtersContainer')
  public filtersContainer: ElementRef;
  @ViewChild('incomeTitleContainer')
  public incomeTitleContainer: ElementRef;
  @ViewChild('headerTitle')
  public headerTitle: ElementRef;

  @Input()
  public query: string;
  @Input()
  public thing: string;
  @Input()
  public hoverPlace: Observable<any>;
  @Input()
  public currentPage: string;

  @Output()
  public filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();

  public header: any = {};
  public location: Location = window.location;
  public isCountryFilterReady: boolean = false;
  public isThingFilterReady: boolean = false;
  public element: HTMLElement;
  public streetData: DrawDividersInterface;
  public activeThing: any;
  public window: Window = window;
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public math: MathService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public languageService: LanguageService;
  public getTranslationSubscription: Subscription;
  public resizeSubscription: Subscription;
  public orientationChangeSubscription: Subscription;
  public scrollSubscription: Subscription;
  public getTranslationSubscribtion: Subscription;
  public queryParamsSubscribe: Subscription;
  public incomeTitleContainerElement: HTMLElement;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public appState: Observable<any>;
  public languages: any;
  public byIncomeText: string;
  public urlParams: any;
  public titleHeaderSubscribe: Subscription;
  public isMatrixPage: boolean;
  public isMapPage: boolean;
  public isFamilyPage: boolean;
  public isAboutPage: boolean;
  public isDonatePage: boolean;
  public isPhotographersPage: boolean;
  public isPhotographerPage: boolean;
  public isCountryPage: boolean;
  public isTeamPage: boolean;
  public routerEventsSubscribe: Subscription;

  public constructor(router: Router,
                     math: MathService,
                     languageService: LanguageService,
                     activatedRoute: ActivatedRoute,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     private changeDetectorRef: ChangeDetectorRef,
                     private thingsFilterActions: ThingsFilterActions,
                     private countriesFilterActions: CountriesFilterActions,
                     private appActions: AppActions,
                     private utilsService: UtilsService,
                     private urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     store: Store<AppStore>,
                     private titleHeaderService: TitleHeaderService,
                     private renderer: Renderer) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.device = browserDetectionService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
    this.element = element.nativeElement;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
    this.appState = this.store.select((dataSet: AppStore) => dataSet.app);
  }

  public ngAfterViewInit(): void {
    let headerContainerElement = this.element.querySelector('.header-container') as HTMLElement;
    let paddingPlaceElement = document.querySelector('.padding-place') as HTMLElement;

    this.resizeSubscription = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.calcIncomeSize();
      });

    this.orientationChangeSubscription = fromEvent(window, 'orientationchange')
      .debounceTime(150)
      .subscribe(() => {
        this.calcIncomeSize();
      });

    this.scrollSubscription = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        let scrollTopOffset = 0;
        let paddingHeight = 0;

        let quickGuideElement = document.querySelector('.quick-guide-container') as HTMLElement;

        if (quickGuideElement) {
          scrollTopOffset += quickGuideElement.clientHeight;
        }

        if (scrollTop > scrollTopOffset) {
          paddingHeight += headerContainerElement.clientHeight;

          if (this.isMatrixPage) {
            let matrixHeaderElement = document.querySelector('.matrix-header') as HTMLElement;

            paddingHeight += matrixHeaderElement.clientHeight;

            matrixHeaderElement.style.position = 'fixed';
            matrixHeaderElement.style.top = headerContainerElement.clientHeight + 'px';

            let streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;
            streetContainerElement.style.position = 'fixed';
          }

          paddingPlaceElement.style.height = paddingHeight + 'px';
          this.toggleStyleClass(headerContainerElement, 'position-fixed', true);
        } else {
          if (this.isMatrixPage) {
            let matrixHeaderElement = document.querySelector('.matrix-header') as HTMLElement;

            matrixHeaderElement.style.position = 'static';
            matrixHeaderElement.style.top = '0px';

            let streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;
            streetContainerElement.style.position = 'static';
          }

          paddingPlaceElement.style.height = '0px';
          this.toggleStyleClass(headerContainerElement, 'position-fixed', false);
        }
      });

    this.calcIncomeSize();
  }

  public applyStyles(): void {
    let headerContainerElement = this.element.querySelector('.header-container') as HTMLElement;
    let iconContainer = this.element.querySelector('.icon-container') as HTMLElement;

    if (headerContainerElement) {
      if (this.isAboutPage || this.isDonatePage || this.isMapPage) {
        this.toggleStyleClass(headerContainerElement, 'bottom-yellow-border', true);
      } else {
        this.toggleStyleClass(headerContainerElement, 'bottom-yellow-border', false);
      }
    }
  }

  public toggleVisibility(el: HTMLElement, show: boolean): void {
    if (show) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
      el.classList.add('hidden');
    }
  }

  public toggleStyleClass(el: HTMLElement, cls: string, toggle: boolean): void {
    if (toggle) {
      if (!el.classList.contains(cls)) {
        el.classList.add(cls);
      }
    } else {
      el.classList.remove(cls);
    }
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();
    this.isTablet = this.device.isTablet();

    this.getTranslationSubscribtion = this.languageService.getTranslation(['BY_INCOME']).subscribe((trans: any) => {
      this.byIncomeText = trans.BY_INCOME;
    });

    this.routerEventsSubscribe = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isMatrixPage = this.isCurrentPage('matrix');
        this.isMapPage = this.isCurrentPage('map');
        this.isFamilyPage = this.isCurrentPage('family');
        this.isAboutPage = this.isCurrentPage('about');
        this.isDonatePage = this.isCurrentPage('donate');
        this.isPhotographerPage = this.isCurrentPage('photographer');
        this.isPhotographersPage = this.isCurrentPage('photographers');
        this.isCountryPage = this.isCurrentPage('country');
        this.isTeamPage = this.isCurrentPage('team');

        this.changeDetectorRef.detectChanges();

        this.rendererTitle(this.titleHeaderService.getTitle());

        this.interactiveIncomeText();
        this.calcIncomeSize();
        this.applyStyles();
      }
    });

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: any) => {
        this.urlParams = {
          thing: params.thing ? decodeURI(params.thing) : 'Families',
          countries: params.countries ? decodeURI(params.countries) : 'World',
          regions: params.regions ? decodeURI(params.regions) : 'World',
          zoom: parseInt(params.zoom, 10) || 4,
          row: parseInt(params.row, 10) || 1,
          lowIncome: parseInt(params.lowIncome, 10),
          highIncome: parseInt(params.highIncome, 10)
        };

        this.interactiveIncomeText();
        this.calcIncomeSize();
        this.applyStyles();
      });

    this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.appState.subscribe((data: any) => {
      if(data) {
        this.query = data.query;
      }
    });

    this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
    });

    this.titleHeaderSubscribe = this.titleHeaderService
      .getTitleEvent()
      .subscribe((data: {title: string}) => {
        this.rendererTitle(data.title);
      });
  }

  public isCurrentPage(name: string): boolean {
    let shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path))[0];

    if (shap) {
      if (shap[0] === name) {
        return true;
      }
    }

    return false;
  }

  public ngOnDestroy(): void {
    if (this.getTranslationSubscription) {
      this.getTranslationSubscription.unsubscribe();
    }

    if (this.orientationChangeSubscription) {
      this.orientationChangeSubscription.unsubscribe();
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }

    if (this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if (this.titleHeaderSubscribe) {
      this.titleHeaderSubscribe.unsubscribe();
    }

    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  public ngOnChanges(changes: any): void {
    if (
      changes.query &&
      typeof changes.query.previousValue === 'string' &&
      typeof changes.query.currentValue === 'string'
    ) {
      let currentQuery = this.utilsService.parseUrl(changes.query.currentValue);
      let previousQuery = this.utilsService.parseUrl(changes.query.previousValue);

      if (currentQuery.place === previousQuery.place) {
        return;
      }
    }
  }

  public rendererTitle(title: string): void {
    if (this.isPhotographerPage && !this.isDesktop) {
      title = Array.from(title).splice(title.indexOf('</span>') + 7).join('');
    }

    if (this.headerTitle) {
      this.renderer.setElementProperty(this.headerTitle.nativeElement, 'innerHTML', title);
    }
  }

  public interactiveIncomeText(): void {
    let incomeContainer: HTMLElement = this.element.querySelector('.income-title-container') as HTMLElement;

    if (!incomeContainer || !this.byIncomeText) {
      return;
    }

    setTimeout(() => {
      incomeContainer.classList.remove('incomeby');
    }, 0);

    if (this.byIncomeText.length > 20 && this.window.innerWidth < 920) {
      setTimeout(() => {
        incomeContainer.classList.add('incomeby');
      },0);
    }
  }

  public calcIncomeSize(): void {
    if(!this.incomeTitleContainer) {
      return;
    }

    this.incomeTitleContainerElement = this.incomeTitleContainer.nativeElement;

    this.incomeTitleContainerElement.classList.remove('short');
    this.incomeTitleContainerElement.classList.remove('long');

    if (this.isMobile) {
      if (this.window.innerWidth < 740) {
        this.incomeTitleContainerElement.classList.add('short');
      } else {
        this.incomeTitleContainerElement.classList.add('long');
      }
    }

    if (this.isTablet) {
      if (this.window.innerWidth < 1040) {
        this.incomeTitleContainerElement.classList.add('short');
      } else {
        this.incomeTitleContainerElement.classList.add('long');
      }
    }

    if (this.isDesktop) {
      if (this.window.innerWidth < 1240) {
        this.incomeTitleContainerElement.classList.add('short');
      } else {
        this.incomeTitleContainerElement.classList.add('long');
      }
    }
  }

  protected openIncomeFilter(): void {
    if (!this.isMobile) {
      return;
    }

    this.store.dispatch(this.appActions.openIncomeFilter(true));
  }

  public thingSelected(data: any): void {
    this.store.dispatch(this.appActions.setQuery(data.url));
    this.store.dispatch(this.appActions.setThing(data.thing));

    this.urlChangeService.replaceState('/matrix', data.url);
  }

  public countrySelected(data: any): void {
    this.store.dispatch(this.appActions.setQuery(data.url));

    this.urlChangeService.replaceState('/matrix', data.url);
  }

  public activeThingTransfer(thing: any): void {
    this.activeThing = thing;
  }

  public goToMatrixPage(): void {
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

    if (this.isMatrixPage) {
      // this.filter.emit({url: this.urlChangeService.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    let queryUrl: string = this.utilsService.objToQuery(queryParams);

    this.store.dispatch(this.thingsFilterActions.getThingsFilter(queryUrl));
    this.store.dispatch(this.countriesFilterActions.getCountriesFilter(queryUrl));

    this.urlChangeService.replaceState('/matrix', queryUrl);

    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
  }

  public isFilterGotData(event: any): any {
    this[event] = true;

    this.changeDetectorRef.detectChanges();
  }
}
