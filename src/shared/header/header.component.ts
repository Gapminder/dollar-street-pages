import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Router, ActivatedRoute } from '@angular/router';
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
  ChangeDetectorRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppState,
  HeaderState
} from '../../interfaces';
import { HeaderActions } from './header.actions';
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
  UrlChangeService
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

  @Input()
  public query: string;
  @Input()
  public thing: string;
  @Input()
  public hoverPlace: Observable<any>;

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
  public matrixComponent: boolean;
  public mapComponent: boolean;
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
  public getTranslationSubscribtion: Subscription;
  public queryParamsSubscribe: Subscription;
  public incomeTitleContainerElement: HTMLElement;
  public store: Store<AppState>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public headerState: Observable<HeaderState>;
  public headerData: HeaderState;
  public languages: any;
  public byIncomeText: string;

  public constructor(router: Router,
                     math: MathService,
                     languageService: LanguageService,
                     activatedRoute: ActivatedRoute,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     private changeDetectorRef: ChangeDetectorRef,
                     private thingsFilterActions: ThingsFilterActions,
                     private countriesFilterActions: CountriesFilterActions,
                     private headerActions: HeaderActions,
                     private urlChangeService: UrlChangeService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     store: Store<AppState>) {
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.device = browserDetectionService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
    this.element = element.nativeElement;
    this.store = store;

    this.streetSettingsState = this.store.select((dataSet: AppState) => dataSet.streetSettings);
    this.headerState = this.store.select((dataSet: AppState) => dataSet.header);
  }

  public ngAfterViewInit(): void {
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

    this.calcIncomeSize();
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();
    this.isTablet = this.device.isTablet();

    this.getTranslationSubscribtion = this.languageService.getTranslation(['BY_INCOME']).subscribe((trans: any) => {
      this.byIncomeText = trans.BY_INCOME;
    });

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: any) => {
        this.matrixComponent = this.location.href.indexOf('matrix') !== -1;
        this.mapComponent = this.location.href.indexOf('map') !== -1;

        this.changeDetectorRef.detectChanges();

        this.interactiveIncomeText();
        this.calcIncomeSize();
      });

    this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.headerState.subscribe((data: HeaderState) => {
      this.headerData = data;

      if(data) {
        this.query = data.query;
      }
    });

    this.languageService.languagesList.subscribe((data: any) => {
      this.languages = data;
    });
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
  }

  public ngOnChanges(changes: any): void {
    if (
      changes.query &&
      typeof changes.query.previousValue === 'string' &&
      typeof changes.query.currentValue === 'string'
    ) {
      let currentQuery = this.urlChangeService.parseUrl(changes.query.currentValue);
      let previousQuery = this.urlChangeService.parseUrl(changes.query.previousValue);

      if (currentQuery.place === previousQuery.place) {
        return;
      }
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

    this.isOpenIncomeFilter.emit({});
  }

  public thingSelected(data: any): void {
    this.store.dispatch(this.headerActions.setQuery(data.url));
    this.store.dispatch(this.headerActions.setThing(data.thing));

    this.urlChangeService.replaceState('/matrix', data.url);
  }

  public countrySelected(data: any): void {
    this.store.dispatch(this.headerActions.setQuery(data.url));

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

    if (this.matrixComponent) {
      // this.filter.emit({url: this.urlChangeService.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    let queryUrl: string = this.urlChangeService.objToQuery(queryParams);

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
