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
  AppStates
} from '../../interfaces';
import * as AppActions from '../../app/ngrx/app.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../things-filter/ngrx/things-filter.actions';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import * as CountriesFilterActions from '../countries-filter/ngrx/countries-filter.actions';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';
import {
  MathService,
  Angulartics2GoogleAnalytics,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService,
  TitleHeaderService,
  ActiveThingService
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
  public activatedRoute: ActivatedRoute;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public getTranslationSubscription: Subscription;
  public resizeSubscription: Subscription;
  public orientationChangeSubscription: Subscription;
  public scrollSubscription: Subscription;
  public queryParamsSubscription: Subscription;
  public incomeTitleContainerElement: HTMLElement;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public appState: Observable<any>;
  public thingsFilterState: Observable<any>;
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
  public isArticlePage: boolean;
  public routerEventsSubscription: Subscription;
  public streetSettingsStateSubscription: Subscription;
  public appStateSubscription: Subscription;
  public languagesListSubscription: Subscription;
  public isInit: boolean;
  public iconContainerShow: boolean;
  public isPinMode: boolean;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public isPinCollapsed: boolean;

  public constructor(private router: Router,
                     private math: MathService,
                     private languageService: LanguageService,
                     activatedRoute: ActivatedRoute,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private changeDetectorRef: ChangeDetectorRef,
                     private utilsService: UtilsService,
                     private urlChangeService: UrlChangeService,
                     private store: Store<AppStates>,
                     private titleHeaderService: TitleHeaderService,
                     private renderer: Renderer,
                     private activeThingService: ActiveThingService) {
    this.activatedRoute = activatedRoute;
    this.device = browserDetectionService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.element = element.nativeElement;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
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
      .debounceTime(10)
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
            let streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;

            paddingHeight += streetContainerElement.clientHeight;

            streetContainerElement.style.position = 'fixed';
            streetContainerElement.style.top = headerContainerElement.clientHeight + 'px';
            streetContainerElement.style.zIndex = '998';
          }

          paddingPlaceElement.style.height = paddingHeight + 'px';

          this.toggleStyleClass(headerContainerElement, 'position-fixed', true);
        } else {
          if (this.isMatrixPage) {
            let streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;

            streetContainerElement.style.position = 'static';
            streetContainerElement.style.zIndex = '0';
          }

          paddingPlaceElement.style.height = '0px';

          this.toggleStyleClass(headerContainerElement, 'position-fixed', false);
        }
      });

    this.calcIncomeSize();
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

    this.getTranslationSubscription = this.languageService.getTranslation(['BY_INCOME']).subscribe((trans: any) => {
      this.byIncomeText = trans.BY_INCOME;
    });

    this.routerEventsSubscription = this.router.events.subscribe((event: any) => {
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
        this.isArticlePage = this.isCurrentPage('article');

        this.changeDetectorRef.detectChanges();

        this.rendererTitle(this.titleHeaderService.getTitle());

        this.interactiveIncomeText();
        this.calcIncomeSize();
      }
    });

    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.urlParams = {
        thing: params.thing ? decodeURI(params.thing) : 'Families',
        countries: params.countries ? decodeURI(params.countries) : 'World',
        regions: params.regions ? decodeURI(params.regions) : 'World',
        zoom: parseInt(params.zoom, 10) || 4,
        row: parseInt(params.row, 10) || 1,
        lowIncome: parseInt(params.lowIncome, 10),
        highIncome: parseInt(params.highIncome, 10)
      };

      this.query = this.utilsService.objToQuery(this.urlParams);

      if(!this.isInit) {
        this.isInit = true;

        this.store.dispatch(new ThingsFilterActions.GetThingsFilter(this.query));
        this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(this.query));

        // this.store.dispatch(this.appActions.setQuery(this.query));
      }

      this.interactiveIncomeText();
      this.calcIncomeSize();
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        this.streetData = data;
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.pinMode) {
          this.isPinMode = true;

          this.changeDetectorRef.detectChanges();

          this.titleHeaderService.setTitle('Families by income');
        } else {
          this.isPinMode = false;
        }
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          this.query = data.query;
        }
      }
    });

    this.languagesListSubscription = this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
    });

    this.titleHeaderSubscribe = this.titleHeaderService.getTitleEvent().subscribe((data: {title: string}) => {
      this.rendererTitle(data.title);
    });
  }

  public isCurrentPage(name: string): boolean {
    let shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
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

    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }

    if (this.titleHeaderSubscribe) {
      this.titleHeaderSubscribe.unsubscribe();
    }

    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    if (this.languagesListSubscription) {
      this.languagesListSubscription.unsubscribe();
    }

    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
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

    this.store.dispatch(new MatrixActions.OpenIncomeFilter(true));
  }

  public thingSelected(data: any): void {
    this.store.dispatch(new AppActions.SetQuery(data.url));
    this.store.dispatch(new MatrixActions.UpdateMatrix(true));

    let pageName: string = '';

    if (this.isMatrixPage) {
      pageName = '/matrix';
    }

    if (this.isMapPage) {
      pageName = '/map';
    }

    this.urlChangeService.replaceState(pageName, data.url);
  }

  public countrySelected(data: any): void {
    this.store.dispatch(new AppActions.SetQuery(data.url));
    this.store.dispatch(new MatrixActions.UpdateMatrix(true));

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

    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));

    this.store.dispatch(new AppActions.SetQuery(queryUrl));
    this.store.dispatch(new MatrixActions.UpdateMatrix(true));

    this.urlChangeService.replaceState('/matrix', queryUrl);

    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
  }

  public isFilterGotData(event: any): any {
    this[event] = true;

    this.changeDetectorRef.detectChanges();
  }
}
