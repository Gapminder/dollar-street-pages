import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { forEach, difference, map, find, get } from 'lodash';
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
  Renderer,
  HostListener
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  TimeUnit,
  Currency,
  AppState,
  StreetSettingsState
} from '../../interfaces';
import * as AppActions from '../../app/ngrx/app.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';
import {
  MathService,
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService,
  TitleHeaderService,
  IncomeCalcService
} from '../../common';
import { DrawDividersInterface } from '../../interfaces';
import { DEBOUNCE_TIME, DefaultUrlParameters } from '../../defaultState';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';

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

  private headerTitle: ElementRef;
  @ViewChild('headerTitle') set controlElRef(elementRef: ElementRef) {
    this.headerTitle = elementRef;

    this.titleHeaderService.setTitle(this.familiesByIncomeTrans);
  }

  @Input()
  public currentPage: string;

  @Output()
  public filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();

  public query: string;
  public thing: string;
  public header: any = {};
  public location: Location = window.location;
  public isCountryFilterReady: boolean = false;
  public isThingFilterReady: boolean = false;
  public element: HTMLElement;
  public streetData: DrawDividersInterface;
  public activeThing: any;
  public window: Window = window;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public getTranslationSubscription: Subscription;
  public resizeSubscription: Subscription;
  public orientationChangeSubscription: Subscription;
  public scrollSubscription: Subscription;
  public queryParamsSubscription: Subscription;
  public incomeTitleContainerElement: HTMLElement;
  public streetSettingsState: Observable<StreetSettingsState>;
  public appState: Observable<AppState>;
  public thingsFilterState: Observable<any>;
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
  public thingsFilterData: any;
  public thingsFilterStateSubscription: any;
  public countriesFilterData: any = {};
  public countriesFilterState: Observable<any>;
  public countriesFilterStateSubscription: Subscription;
  public theWorldText: string;
  public backToCountries: string;
  public isPinMode: boolean;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public familiesByIncomeTrans = 'Families by income';
  public isIncomeDesktopOpened: boolean;
  public timeUnit: TimeUnit;
  public timeUnits: TimeUnit[];
  public currencyUnit: Currency;
  public currencyUnits: Currency[];
  public timeUnitTemp: TimeUnit;
  public currencyUnitTemp: Currency;
  public isEmbedMode: boolean;
  public headerContainerElement: HTMLElement;
  public paddingPlaceElement: HTMLElement;
  public byDollarText: string;
  public incomeTitleText: string;
  public isIncomeFilter: boolean;

  public constructor(elementRef: ElementRef,
                     private router: Router,
                     private math: MathService,
                     private languageService: LanguageService,
                     private activatedRoute: ActivatedRoute,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private changeDetectorRef: ChangeDetectorRef,
                     private utilsService: UtilsService,
                     private urlChangeService: UrlChangeService,
                     private store: Store<AppStates>,
                     private titleHeaderService: TitleHeaderService,
                     private renderer: Renderer,
                     private incomeCalcService: IncomeCalcService,
                     private urlParametersService: UrlParametersService) {
    this.element = elementRef.nativeElement;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);

    this.thingsFilterState = this.store.select((appStates: AppStates) => appStates.thingsFilter);
    this.countriesFilterState = this.store.select((appStates: AppStates) => appStates.countriesFilter);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  @HostListener('document:click', ['$event'])
  public isOutsideIncomeFilterClick(event: any): void {
    const container = this.element.querySelector('.income-title-container');
    if (container && !container.contains(event.target) && this.isIncomeDesktopOpened) {
      this.closeIncomeFilterDesktop(new MouseEvent(''));
    }
  }

  public ngAfterViewInit(): void {
    this.headerContainerElement = this.element.querySelector('.header-container') as HTMLElement;
    this.paddingPlaceElement = document.querySelector('.padding-place') as HTMLElement;

    this.resizeSubscription = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.calcIncomeSize();
        this.checkByIncomeFilter();
      });

    this.orientationChangeSubscription = fromEvent(window, 'orientationchange')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.calcIncomeSize();
      });

    this.scrollSubscription = fromEvent(document, 'scroll')
      .subscribe(() => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        let scrollTopOffset = 0;

        let quickGuideElement = document.querySelector('.quick-guide-container') as HTMLElement;

        if (quickGuideElement) {
          scrollTopOffset += quickGuideElement.clientHeight;
        }

        if (scrollTop > scrollTopOffset) {
          if (this.isPinMode || this.isEmbedMode) {
            return;
          }

          this.checkHeaderFloat();
        } else {
          this.preventHeaderFloat();
        }
    });

    this.calcIncomeSize();
  }

  public checkHeaderFloat(): void {
    let paddingHeight = 0;

    paddingHeight += this.headerContainerElement.clientHeight;

    if (this.isMatrixPage) {
      const streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;

      paddingHeight += streetContainerElement.clientHeight;

      streetContainerElement.style.position = 'fixed';
      streetContainerElement.style.top = this.headerContainerElement.clientHeight + 'px';
      streetContainerElement.style.zIndex = '998';
    }

    this.paddingPlaceElement.style.height = `${paddingHeight}px`;

    this.toggleStyleClass(this.headerContainerElement, 'position-fixed', true);
  }

  public preventHeaderFloat(): void {
    if (this.isMatrixPage) {
      const streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;

      streetContainerElement.style.position = 'static';
      streetContainerElement.style.zIndex = '0';
    }

    this.paddingPlaceElement.style.height = '0px';

    this.toggleStyleClass(this.headerContainerElement, 'position-fixed', false);
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

  public checkByIncomeFilter(): void {
    if (this.isDesktop) {
      this.incomeTitleText = this.byIncomeText;
      this.isIncomeFilter = true;
    }

    if (this.isTablet || this.isMobile) {
      this.incomeTitleText = this.byDollarText;

      this.isIncomeFilter = !this.isTablet;
    }
  }

  public ngOnInit(): void {
    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isTablet = this.browserDetectionService.isTablet();

    this.store.dispatch(new MatrixActions.GetCurrencyUnits());
    this.store.dispatch(new MatrixActions.GetTimeUnits());

    this.getTranslationSubscription = this.languageService.getTranslation(['BY_INCOME', 'BY_DOLLAR', 'THE_WORLD']).subscribe((trans: any) => {
      this.byIncomeText = trans.BY_INCOME;
      this.byDollarText = trans.BY_DOLLAR;
      this.theWorldText = trans.THE_WORLD;

      this.checkByIncomeFilter();
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
        highIncome: parseInt(params.highIncome, 10),
        lang: params.lang ? decodeURI(params.lang) : this.languageService.currentLanguage,
        currency: params.currency ? decodeURI(params.currency.toUpperCase()) : '',
        time: params.time ? decodeURI(params.time.toUpperCase()) : 'MONTH',
        labels: params.labels ? (decodeURI(params.labels) === 'true' ? true : false) : false,
        activeHouse: parseInt(params.activeHouse, 10)
      };

      this.interactiveIncomeText();
      this.calcIncomeSize();
    });

    this.appStateSubscription = this.appState.subscribe((data: AppState) => {
      if (get(data, 'query', false) && this.query !== data.query) {
        this.query = data.query;
      }
    });

    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (get(data, 'streetSettings', false) && this.streetData !== data.streetSettings) {
            this.streetData = data.streetSettings;
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (get(data, 'pinMode', false)) {
        this.isPinMode = true;
        this.preventHeaderFloat();
      } else {
        this.isPinMode = false;
      }

      if (get(data, 'embedMode', false)) {
        this.isEmbedMode = true;
        this.preventHeaderFloat();
      } else {
        this.isEmbedMode = false;
      }

      if (get(data, 'timeUnits', false) && this.timeUnits !== data.timeUnits) {
        this.timeUnits = data.timeUnits;

        this.timeUnitTemp = this.incomeCalcService.getTimeUnitByCode(this.timeUnits, this.urlParams.time);

        this.timeUnit = this.timeUnitTemp;

        this.store.dispatch(new MatrixActions.SetTimeUnit(this.timeUnit));
      }

      if (get(data, 'currencyUnits', false) && this.currencyUnits !== data.currencyUnits) {
        this.currencyUnits = data.currencyUnits;

        if (!this.currencyUnit) {
          if (this.urlParams.currency) {
            this.currencyUnitTemp = this.incomeCalcService.getCurrencyUnitByCode(this.currencyUnits, this.urlParams.currency);
          } else {
            this.currencyUnitTemp = this.incomeCalcService.getCurrencyUnitForLang(this.currencyUnits, this.languageService.currentLanguage);
          }
          this.currencyUnit = this.currencyUnitTemp;
        }
      }
      this.changeDetectorRef.detectChanges();
    });

    this.thingsFilterStateSubscription = this.thingsFilterState.subscribe((data: any) => {
      if (data) {
        if (data.thingsFilter) {
          this.thingsFilterData = data.thingsFilter;
        }
      }
    });

    this.countriesFilterStateSubscription = this.countriesFilterState.subscribe((data: any) => {
      if (data) {
        if (data.countriesFilter) {
          this.countriesFilterData.countriesFilter = data.countriesFilter;
        }

        if (data.selectedCountries) {
          this.countriesFilterData.selectedCountries = data.selectedCountries;
        }

        if (data.selectedRegions) {
          this.countriesFilterData.selectedRegions = data.selectedRegions;
        }

        const selCountries = this.countriesFilterData.selectedCountries;
        const selRegions = this.countriesFilterData.selectedRegions;
        const allLocations = this.countriesFilterData.countriesFilter;

        if (allLocations && selRegions && selCountries) {
          this.backToCountries = this.getCountriesTitle(allLocations, selRegions, selCountries);

          this.changeDetectorRef.detectChanges();
        }
      }
    });

    this.titleHeaderSubscribe = this.titleHeaderService.getTitleEvent().subscribe((data: {title: string}) => {
      this.rendererTitle(data.title);
    });
  }

  public isCurrentPage(name: string): boolean {
    const shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
        return true;
      }
    }

    return false;
  }

  public openIncomeFilterDesktop(e: MouseEvent): void {
    this.isIncomeDesktopOpened = true;
  }

  public closeIncomeFilterDesktop(e: MouseEvent): void {

    this.isIncomeDesktopOpened = false;

    this.timeUnitTemp = this.timeUnit;
    this.currencyUnitTemp = this.currencyUnit;
  }

  public incomeContainerClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  public timeUnitFilterSelect(code: string): void {
    this.timeUnitTemp = this.incomeCalcService.getTimeUnitByCode(this.timeUnits, code);
  }

  public currencyUnitFilterSelect(code: string): void {
    this.currencyUnitTemp = this.incomeCalcService.getCurrencyUnitByCode(this.currencyUnits, code);
  }

  public applyIncomeFilterDesktop(e): void {
    this.openIncomeFilterDesktop(e);
    this.timeUnit = this.timeUnitTemp;
    this.currencyUnit = this.currencyUnitTemp;

    this.store.dispatch(new MatrixActions.SetCurrencyUnit(this.currencyUnit));
    this.store.dispatch(new MatrixActions.SetTimeUnit(this.timeUnit));

    this.isIncomeDesktopOpened = false;
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

    if (this.thingsFilterStateSubscription) {
      this.thingsFilterStateSubscription.unsubscribe();
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
    const incomeContainer: HTMLElement = this.element.querySelector('.income-title-container') as HTMLElement;

    if (!incomeContainer || !this.byIncomeText) {
      return;
    }

    setTimeout(() => {
      incomeContainer.classList.remove('incomeby');
    }, 0);

    if (this.byIncomeText.length > 20 && this.window.innerWidth < 920) {
      setTimeout(() => {
        incomeContainer.classList.add('incomeby');
      }, 0);
    }
  }

  public calcIncomeSize(): void {
    if (!this.incomeTitleContainer) {
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

  public openIncomeFilter(e: any): void {
    if (!this.isIncomeFilter) {
      return;
    }

    /*
    TODO: hided desktop income filter for prod 20.02.18

    if (this.isIncomeDesktopOpened) {
      this.closeIncomeFilterDesktop(new MouseEvent(''));
      return;
    }

    if (!this.isMobile) {
      this.openIncomeFilterDesktop(e);
    }
    */

    this.store.dispatch(new MatrixActions.OpenIncomeFilter(true));
  }

  public activeThingTransfer(thing: any): void {
    this.activeThing = thing;
  }

  public scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  public goToMatrixFromFamilyPage(): void {
    this.router.navigate(['/matrix'], {queryParams: this.utilsService.parseUrl(this.query)});
  }

  public goToMatrixPage(): void {
    this.scrollTopZero();
    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
  }

  public isFilterGotData(event: any): any {
    this[event] = true;

    this.changeDetectorRef.detectChanges();
  }

  public getCountriesTitle(inputLocations: any, regions: string[], countries: string[]): string {
    let getTranslatedCountries;
    let getTranslatedRegions;

    let title: string;

    if (countries[0] !== 'World') {
      let allCountries = [];

      forEach(inputLocations, (loc) => {
        allCountries = [...allCountries, ...loc.countries];
      });

      getTranslatedCountries = map(countries, (item: string): any => {
        const findTransName: any = find(allCountries, {originName: item});
        return findTransName ? findTransName.country : item;
      });
    }

    if (regions[0] !== 'World') {
      getTranslatedRegions = map(regions, (item: string): any => {
        const findTransName: any = find(inputLocations, {originRegionName: item});
        return findTransName ? findTransName.region : item;
      });
    }

    if (regions[0] === 'World' && countries[0] === 'World') {
      return this.theWorldText;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        title = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        title = getTranslatedCountries.join(' & ');
      }

      return title;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        title = getTranslatedCountries.slice(0, 2).join(', ') + ' (+' + (getTranslatedCountries.length - 2) + ')';
      } else {
        let sumCountries = 0;
        let getDifference: string[] = [];
        let regionCountries: string[] = [];

        forEach(inputLocations, (location: any) => {
          if (regions.indexOf(location.originRegionName) !== -1) {
            regionCountries = regionCountries.concat(map(location.countries, 'country') as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          getDifference = difference(getTranslatedCountries, regionCountries);
        }

        if (getDifference.length) {
          title = getDifference.length === 1 && regions.length === 1 ? getTranslatedRegions[0] + ' & '
          + getDifference[0] : getTranslatedCountries.slice(0, 2).join(', ')
          + ' (+' + (getTranslatedCountries.length - 2) + ')';
        } else {
          title = getTranslatedRegions.join(' & ');
        }
      }

      return title;
    }

    const concatLocations: string[] = regions.concat(getTranslatedCountries);

    if (concatLocations.length > 2) {
      title = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      title = concatLocations.join(' & ');
    }

    return title;
  }

  resetStage(): void {
    this.urlParametersService.dispatchToStore(DefaultUrlParameters)
  }
}
