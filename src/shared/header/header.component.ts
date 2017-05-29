import { Component, Input, Output, OnChanges, EventEmitter, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';

import {
  MathService,
  Angulartics2GoogleAnalytics,
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService
} from '../../common';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  public element: HTMLElement;

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
  @Input('hoverPlace')
  public hoverPlace: Observable<any>;
  public header: any = {};
  public isCountryFilterReady: boolean = false;
  public isThingFilterReady: boolean = false;

  @Output()
  public filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public isOpenIncomeFilter: EventEmitter<any> = new EventEmitter<any>();
  public streetData: DrawDividersInterface;
  public activeThing: any;
  public window: Window = window;
  public zone: NgZone;
  public router: Router;
  public activatedRoute: ActivatedRoute;
  public matrixComponent: boolean;
  public mapComponent: boolean;
  public math: MathService;
  public streetServiceSubscribe: Subscription;
  public streetSettingsService: StreetSettingsService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public isMobile: boolean;
  public isTablet: boolean;
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public orientationChange: Subscription;
  public incomeContainer: HTMLElement;

  public constructor(router: Router,
                     math: MathService,
                     zone: NgZone,
                     languageService: LanguageService,
                     activatedRoute: ActivatedRoute,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
                     ) {
    this.router = router;
    this.zone = zone;
    this.activatedRoute = activatedRoute;
    this.math = math;
    this.device = browserDetectionService;
    this.streetSettingsService = streetSettingsService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
    this.element = element.nativeElement;

    this.matrixComponent = this.activatedRoute.snapshot.url[0].path === 'matrix';
    this.mapComponent = this.activatedRoute.snapshot.url[0].path === 'map';
  }

  public ngAfterViewInit(): void {
    this.incomeContainer = this.element.querySelector('.income-title-container') as HTMLElement;

    this.calcIncomeSize();
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();
    this.isTablet = this.device.isTablet();

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
         this.calcIncomeSize();
        });
      });

    this.orientationChange = fromEvent(window, 'orientationchange')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.calcIncomeSize();
        });
      });
  }

  public ngOnDestroy(): void {
    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.orientationChange) {
      this.orientationChange.unsubscribe();
    }
  }

  public ngOnChanges(changes: any): void {
    if (
      changes.query &&
      typeof changes.query.previousValue === 'string' &&
      typeof changes.query.currentValue === 'string'
    ) {
      let currentQuery = this.parseUrl(changes.query.currentValue);
      let previousQuery = this.parseUrl(changes.query.previousValue);

      if (currentQuery.place === previousQuery.place) {
        return;
      }
    }
  }

  public calcIncomeSize(): void {
    this.incomeContainer.classList.remove('short');
    this.incomeContainer.classList.remove('long');

    if (this.isMobile) {
      if (this.window.innerWidth < 740) {
        this.incomeContainer.classList.add('short');
      } else {
        this.incomeContainer.classList.add('long');
      }
    }

    if (this.isTablet) {
       if (this.window.innerWidth < 1040) {
        this.incomeContainer.classList.add('short');
      } else {
        this.incomeContainer.classList.add('long');
      }
    }

    if (this.isDesktop) {
      if (this.window.innerWidth < 1240) {
        this.incomeContainer.classList.add('short');
      } else {
        this.incomeContainer.classList.add('long');
      }
    }
  }

  protected openIncomeFilter(): void {
    if (!this.isMobile) {
      return;
    }

    this.isOpenIncomeFilter.emit({});
  }

  public urlTransfer(data: any): void {
    this.filter.emit(data);
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
      this.filter.emit({url: this.objToQuery(queryParams)});
    } else {
      this.router.navigate(['/matrix'], {queryParams: queryParams});
    }

    this.angulartics2GoogleAnalytics.eventTrack('From header to Matrix page', {});
  }

  public isFilterGotData(event: any): any {
    this[event] = true;
  }

  private parseUrl(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    if (query.regions) {
      query.regions = query.regions.split(',');
    }

    if (query.countries) {
      query.countries = query.countries.split(',');
    }

    return query;
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }
}
