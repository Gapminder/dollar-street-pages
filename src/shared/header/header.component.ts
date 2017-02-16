<<<<<<< 52877b4563cf2b2119088b49e9ff9c265ab9da7e
import { Component, Input, Output, OnChanges, EventEmitter, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
=======
import { Component, Input, Output, OnChanges, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
>>>>>>> ref(matrix): add viewchild to matrix page
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from '../../common';
import { ThingsFilterComponent } from '../things-filter/things-filter.component';
import { CountriesFilterComponent } from '../countries-filter/countries-filter.component';

import {
  MathService,
  Angulartics2GoogleAnalytics,
  StreetSettingsService,
  DrawDividersInterface,
  BrowserDetectionService
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
  public languageService: LanguageService;
  public getTranslationSubscribe: Subscription;

  public constructor(router: Router,
                     math: MathService,
                     languageService: LanguageService,
                     activatedRoute: ActivatedRoute,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     element: ElementRef,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.router = router;
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
    this.getTranslationSubscribe = this.languageService.getTranslation('BY_INCOME').subscribe((incomeText: string) => {
      let incomeContainer: HTMLElement = this.element.querySelector('.income-title-container') as HTMLElement;

      setTimeout(() => {
        //incomeContainer.classList.remove('incomeby');
      }, 0);

      if (incomeText.length > 20 && this.window.innerWidth < 920) {
        setTimeout(() => {
          //incomeContainer.classList.add('incomeby');
        },0);
      }
    });
  }

  public ngOnInit(): void {
    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();

    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
      });
  }

  public ngOnDestroy(): void {
    this.getTranslationSubscribe.unsubscribe();
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
