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
  StreetSettingsState,
  TranslationsInterface,
  SubscriptionsList,
  MatrixState,
  ThingsState,
  CountriesFilterState,
  LanguageState, UrlParameters
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
  thingsFilterComponent: ThingsFilterComponent;
  @ViewChild(CountriesFilterComponent)
  countriesFilterComponent: CountriesFilterComponent;
  @ViewChild('filtersContainer')
  filtersContainer: ElementRef;
  @ViewChild('incomeTitleContainer')
  incomeTitleContainer: ElementRef;


  @ViewChild('headerTitle') set controlElRef(elementRef: ElementRef) {
    this.headerTitle = elementRef;

    this.titleHeaderService.setTitle(this.familiesByIncomeTrans);
  }

  @Input()
  currentPage: string;

  @Output()
  filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();

  query: string;
  thing: string;
  header: any = {};
  location: Location = window.location;
  isCountryFilterReady = false;
  isThingFilterReady = false;
  element: HTMLElement;
  streetData: DrawDividersInterface;
  activeThing: any;
  window: Window = window;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  incomeTitleContainerElement: HTMLElement;
  byIncomeText: string;
  urlParams;
  isMatrixPage: boolean;
  isMapPage: boolean;
  isFamilyPage: boolean;
  isAboutPage: boolean;
  isDonatePage: boolean;
  isPhotographersPage: boolean;
  isPhotographerPage: boolean;
  isCountryPage: boolean;
  isTeamPage: boolean;
  isArticlePage: boolean;
  thingsFilterData: any;
  countriesFilterData: any = {};
  theWorldText: string;
  backToCountries: string;
  isPinMode: boolean;
  familiesByIncomeTrans = 'Families by income';
  isIncomeDesktopOpened: boolean;
  timeUnit: TimeUnit;
  timeUnits: TimeUnit[];
  currencyUnit: Currency;
  currencyUnits: Currency[];
  timeUnitTemp: TimeUnit;
  currencyUnitTemp: Currency;
  isEmbedMode: boolean;
  headerContainerElement: HTMLElement;
  paddingPlaceElement: HTMLElement;
  byDollarText: string;
  incomeTitleText: string;
  isIncomeFilter: boolean;
  ngSubscriptions: SubscriptionsList = {};
  private headerTitle: ElementRef;

  constructor(elementRef: ElementRef,
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
  }

  @HostListener('document:click', ['$event'])
  isOutsideIncomeFilterClick(event: any): void {
    const container = this.element.querySelector('.income-title-container');
    if (container && !container.contains(event.target) && this.isIncomeDesktopOpened) {
      this.closeIncomeFilterDesktop(new MouseEvent(''));
    }
  }

  ngAfterViewInit(): void {
    this.headerContainerElement = this.element.querySelector('.header-container') as HTMLElement;
    this.paddingPlaceElement = document.querySelector('.padding-place') as HTMLElement;

    this.ngSubscriptions.resize = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.calcIncomeSize();
        this.checkByIncomeFilter();
      });

    this.ngSubscriptions.orientationChange = fromEvent(window, 'orientationchange')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.calcIncomeSize();
      });

    this.ngSubscriptions.scroll = fromEvent(document, 'scroll')
      .subscribe(() => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        let scrollTopOffset = 0;

        const quickGuideElement = document.querySelector('.quick-guide-container') as HTMLElement;

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

  checkHeaderFloat(): void {
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

  preventHeaderFloat(): void {
    if (this.isMatrixPage) {
      const streetContainerElement = document.querySelector('.street-and-title-container') as HTMLElement;

      streetContainerElement.style.position = 'static';
      streetContainerElement.style.zIndex = '0';
    }

    this.paddingPlaceElement.style.height = '0px';

    this.toggleStyleClass(this.headerContainerElement, 'position-fixed', false);
  }

  toggleStyleClass(el: HTMLElement, cls: string, toggle: boolean): void {
    if (toggle) {
      if (!el.classList.contains(cls)) {
        el.classList.add(cls);
      }
    } else {
      el.classList.remove(cls);
    }
  }

  checkByIncomeFilter(): void {
    if (this.isDesktop) {
      this.incomeTitleText = this.byIncomeText;
      this.isIncomeFilter = true;
    }

    if (this.isTablet || this.isMobile) {
      this.incomeTitleText = this.byDollarText;

      this.isIncomeFilter = !this.isTablet;
    }
  }

  getTranslations(trans: TranslationsInterface): void {
    if (get(trans, 'BY_INCOME', false)) {
      this.byIncomeText = trans.BY_INCOME;
    }
    if (get(trans, 'BY_DOLLAR', false)) {
      this.byDollarText = trans.BY_DOLLAR;
    }
    if (get(trans, 'THE_WORLD', false)) {
      this.theWorldText = trans.THE_WORLD;
    }
  }

  ngOnInit(): void {
    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();
    this.isTablet = this.browserDetectionService.isTablet();

    this.store.dispatch(new MatrixActions.GetCurrencyUnits());
    this.store.dispatch(new MatrixActions.GetTimeUnits());

    this.ngSubscriptions.getTranslation = this.languageService.getTranslation(['BY_INCOME', 'BY_DOLLAR', 'THE_WORLD']).subscribe((trans: TranslationsInterface) => {
      this.getTranslations(trans);

      this.checkByIncomeFilter();
    });

    this.ngSubscriptions.combileTranslations = Observable
      .fromEvent(this.languageService.translationsLoadedEvent, this.languageService.translationsLoadedString)
      .subscribe(( trans: TranslationsInterface ) => {
      this.getTranslations(trans)
    });

    this.ngSubscriptions.routerEvents = this.router.events.subscribe( event => {
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

    this.ngSubscriptions.queryParams = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.urlParams = {
        thing: params.thing ? decodeURI(params.thing) : 'Families',
        countries: params.countries ? decodeURI(params.countries) : ['World'],
        regions: params.regions ? decodeURI(params.regions) : ['World'],
        zoom: parseInt(params.zoom, 10).toString() || '4',
        row: parseInt(params.row, 10).toString() || '1',
        lowIncome: parseInt(params.lowIncome, 10).toString(),
        highIncome: parseInt(params.highIncome, 10).toString(),
        lang: params.lang ? decodeURI(params.lang) : this.languageService.currentLanguage,
        currency: params.currency ? decodeURI(params.currency.toUpperCase()) : '',
        time: params.time ? decodeURI(params.time.toUpperCase()) : 'MONTH',
        activeHouse: parseInt(params.activeHouse, 10).toString()
      };

      // TODO: has in url, unknow for what
      // labels: params.labels ? (decodeURI(params.labels) === 'true' ? true : false) : false,

      this.interactiveIncomeText();
      this.calcIncomeSize();
    });

    this.ngSubscriptions.appState = this.store
      .select((appStates: AppStates) => appStates.language)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((language: LanguageState) => {
        // const trans = language.translations;
        // this.getTranslations(trans);
      });

    this.ngSubscriptions.appState = this.store
      .select((appStates: AppStates) => appStates.app)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((app: AppState) => {
      if (get(app, 'query', false) && this.query !== app.query) {
        this.query = app.query;
      }
    });

    this.ngSubscriptions.streetSettingsState = this.store
      .select((appStates: AppStates) => appStates.streetSettings)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((streetSettings: StreetSettingsState) => {
      if (get(streetSettings, 'streetSettings', false) && this.streetData !== streetSettings.streetSettings) {
            this.streetData = streetSettings.streetSettings;
      }
    });

    this.ngSubscriptions.matrixState = this.store
      .select((appStates: AppStates) => appStates.matrix)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((matrix: MatrixState) => {
      if (get(matrix, 'pinMode', false)) {
        this.isPinMode = true;
        this.preventHeaderFloat();
      } else {
        this.isPinMode = false;
      }

      if (get(matrix, 'embedMode', false)) {
        this.isEmbedMode = true;
        this.preventHeaderFloat();
      } else {
        this.isEmbedMode = false;
      }

      if (get(matrix, 'timeUnits', false) && this.timeUnits !== matrix.timeUnits) {
        this.timeUnits = matrix.timeUnits;

        this.timeUnitTemp = this.incomeCalcService.getTimeUnitByCode(this.timeUnits, this.urlParams.time);

        this.timeUnit = this.timeUnitTemp;

        this.store.dispatch(new MatrixActions.SetTimeUnit(this.timeUnit));
      }

      if (get(matrix, 'currencyUnits', false) && this.currencyUnits !== matrix.currencyUnits) {
        this.currencyUnits = matrix.currencyUnits;

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

    this.ngSubscriptions.thingsFilterState = this.store
      .select((appStates: AppStates) => appStates.thingsFilter)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((thingsFilter: ThingsState) => {
      if (thingsFilter) {
        if (thingsFilter.thingsFilter) {
          this.thingsFilterData = thingsFilter.thingsFilter;
        }
      }
    });

    this.ngSubscriptions.countriesFilterState = this.store
      .select((appStates: AppStates) => appStates.countriesFilter)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((CountriesFilter: CountriesFilterState) => {
      if (CountriesFilter) {
        if (CountriesFilter.countriesFilter) {
          this.countriesFilterData.countriesFilter = CountriesFilter.countriesFilter;
        }

        if (CountriesFilter.selectedCountries) {
          this.countriesFilterData.selectedCountries = CountriesFilter.selectedCountries;
        }

        if (CountriesFilter.selectedRegions) {
          this.countriesFilterData.selectedRegions = CountriesFilter.selectedRegions;
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

    this.ngSubscriptions.titleHeader = this.titleHeaderService.getTitleEvent().subscribe((data: {title: string}) => {
      this.rendererTitle(data.title);
    });
  }

  isCurrentPage(name: string): boolean {
    const shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
        return true;
      }
    }

    return false;
  }

  openIncomeFilterDesktop(e: MouseEvent): void {
    this.isIncomeDesktopOpened = true;
  }

  closeIncomeFilterDesktop(e: MouseEvent): void {

    this.isIncomeDesktopOpened = false;

    this.timeUnitTemp = this.timeUnit;
    this.currencyUnitTemp = this.currencyUnit;
  }

  incomeContainerClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  timeUnitFilterSelect(code: string): void {
    this.timeUnitTemp = this.incomeCalcService.getTimeUnitByCode(this.timeUnits, code);
  }

  currencyUnitFilterSelect(code: string): void {
    this.currencyUnitTemp = this.incomeCalcService.getCurrencyUnitByCode(this.currencyUnits, code);
  }

  applyIncomeFilterDesktop(e): void {
    this.openIncomeFilterDesktop(e);
    this.timeUnit = this.timeUnitTemp;
    this.currencyUnit = this.currencyUnitTemp;

    this.store.dispatch(new MatrixActions.SetCurrencyUnit(this.currencyUnit));
    this.store.dispatch(new MatrixActions.SetTimeUnit(this.timeUnit));

    this.isIncomeDesktopOpened = false;
  }

  ngOnDestroy(): void {
    forEach(this.ngSubscriptions, (value, key) => {
      value.unsubscribe();
    });
  }

  rendererTitle(title: string): void {
    if (this.isPhotographerPage && !this.isDesktop) {
      title = Array.from(title).splice(title.indexOf('</span>') + 7).join('');
    }

    if (this.headerTitle) {
      this.renderer.setElementProperty(this.headerTitle.nativeElement, 'innerHTML', title);
    }
  }

  interactiveIncomeText(): void {
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

  calcIncomeSize(): void {
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

  openIncomeFilter(e: any): void {
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

  activeThingTransfer(thing: any): void {
    this.activeThing = thing;
  }

  scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  goToMatrixFromFamilyPage(): void {
    this.router.navigate(['/matrix'], {queryParams: this.utilsService.parseUrl(this.query)});
  }

  goToMatrixPage(): void {
    this.scrollTopZero();
    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
  }

  isFilterGotData(event: any): any {
    this[event] = true;

    this.changeDetectorRef.detectChanges();
  }

  getCountriesTitle(inputLocations: any, regions: string[], countries: string[]): string {
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
