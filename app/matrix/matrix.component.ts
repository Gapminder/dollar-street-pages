import { Component, OnInit, ElementRef, OnDestroy, AfterViewChecked, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Observable, Subscription, Subject } from 'rxjs/Rx';
import { Config, ImageResolutionInterface } from '../app.config';
import * as _ from 'lodash';
import { MatrixService } from './matrix.service';
import { LoaderService } from '../common/loader/loader.service';
import { UrlChangeService } from '../common/url-change/url-change.service';
import { CountriesFilterService } from '../common/countries-filter/countries-filter.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

let device: {desktop: Function; mobile: Function} = require('device.js')();
let isMobile: boolean = device.mobile();

@Component({
  selector: 'matrix',
  template: require('./matrix.template.html') as string,
  styles: [require('./matrix.css') as string]
})

export class MatrixComponent implements OnInit, OnDestroy, AfterViewChecked {
  private zoomPositionFixed: boolean = false;
  private isOpenIncomeFilter: boolean = false;
  private isDesktop: boolean = device.desktop();
  private hoverPlace: Subject<any> = new Subject<any>();
  private streetPlaces: Subject<any> = new Subject<any>();
  private matrixPlaces: Subject<any> = new Subject<any>();
  private chosenPlaces: Subject<any> = new Subject<any>();
  private clearActiveHomeViewBox: Subject<any> = new Subject<any>();
  private row: number;
  private zoom: number;
  private lowIncome: number;
  private highIncome: number;
  private activeHouse: number;
  private imageHeight: number;
  private imageMargin: number;
  private footerHeight: number;
  private visiblePlaces: number;
  private rowEtalon: number = 0;
  private windowInnerWidth: number = window.innerWidth;
  private windowInnerHeight: number = window.innerHeight;
  private placesVal: any;
  private locations: any;
  private streetData: any;
  private selectedRegions: any;
  private activeCountries: any;
  private streetPlacesData: any;
  private selectedCountries: any;
  private placesArr: any[];
  private clonePlaces: any[];
  private filtredPlaces: any[] = [];
  private windowHistory: any = history;
  private scrollSubscribeForMobile: Subscription;
  private resizeSubscribe: Subscription;
  private queryParamsSubscribe: Subscription;
  private headerFixedSubscribe: Subscription;
  private matrixServiceSubscribe: Subscription;
  private matrixServiceStreetSubscribe: Subscription;
  private countriesFilterServiceSubscribe: Subscription;
  private thing: string;
  private query: string;
  private regions: string;
  private countries: string;
  private zone: NgZone;
  private router: Router;
  private matrixService: MatrixService;
  private loaderService: LoaderService;
  private activatedRoute: ActivatedRoute;
  private urlChangeService: UrlChangeService;
  private countriesFilterService: CountriesFilterService;
  private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  private element: HTMLElement;
  private imageResolution: ImageResolutionInterface = Config.getImageResolution();
  private streetContainer: HTMLElement;
  private headerContainer: HTMLElement;
  private imgContent: HTMLElement;
  private locationStrategy: LocationStrategy;
  private guidePositionTop: number = 0;
  private matrixHeader: HTMLElement;
  private matrixHeaderHeight: number = 0;

  public constructor(zone: NgZone,
                     router: Router,
                     activatedRoute: ActivatedRoute,
                     element: ElementRef,
                     locationStrategy: LocationStrategy,
                     matrixService: MatrixService,
                     loaderService: LoaderService,
                     urlChangeService: UrlChangeService,
                     countriesFilterService: CountriesFilterService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    this.zone = zone;
    this.router = router;
    this.locationStrategy = locationStrategy;
    this.activatedRoute = activatedRoute;
    this.matrixService = matrixService;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.urlChangeService = urlChangeService;
    this.countriesFilterService = countriesFilterService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): void {
    this.streetContainer = this.element.querySelector('.street-container') as HTMLElement;
    this.headerContainer = this.element.querySelector('.matrix-header') as HTMLElement;
    this.matrixHeader = this.element.querySelector('quick-guide') as HTMLElement;

    this.resizeSubscribe = Observable.fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          if (window.innerWidth === this.windowInnerWidth) {
            return;
          }

          this.windowInnerHeight = window.innerHeight;
          this.windowInnerWidth = window.innerWidth;

          this.interactiveIncomeText();
        });
      });

    this.locationStrategy.onPopState(() => {
      if (this.streetData && this.locations) {
        this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;
        this.urlChanged({isBack: true});

        if (this.matrixHeader) {
          this.matrixHeaderHeight = this.matrixHeader.offsetHeight;
        }

        if (this.matrixHeader && (this.activeHouse || this.row > 1 || Math.ceil(this.activeHouse / this.zoom) === this.row)) {
          this.guidePositionTop = this.matrixHeader.offsetHeight;
        }
      }
    });

    this.queryParamsSubscribe = this.activatedRoute
      .queryParams
      .subscribe((params: any) => {
        this.thing = decodeURI(params.thing || 'Families');
        this.countries = params.countries ? decodeURI(params.countries) : 'World';
        this.regions = params.regions ? decodeURI(params.regions) : 'World';
        this.zoom = parseInt(params.zoom, 10);
        this.lowIncome = parseInt(params.lowIncome, 10);
        this.highIncome = parseInt(params.highIncome, 10);
        this.activeHouse = parseInt(params.activeHouse, 10);
        this.row = parseInt(params.row, 10) || 1;
      });

    this.countriesFilterServiceSubscribe = this.countriesFilterService
      .getCountries(`thing=${this.thing}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.locations = res.data;
      });

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.matrixServiceStreetSubscribe = this.matrixService.getStreetSettings()
      .subscribe((val: any) => {
        if (val.err) {
          console.error(val.err);

          return;
        }

        this.streetData = val.data;
        this.lowIncome = this.lowIncome ? this.lowIncome : this.streetData.poor;
        this.highIncome = this.highIncome ? this.highIncome : this.streetData.rich;

        if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
          this.zoom = 4;
        }

        if (!this.isDesktop) {
          this.zoom = 3;
        }

        this.thing = this.thing ? this.thing : 'Families';
        this.zoom = this.zoom ? this.zoom : 4;
        this.regions = this.regions ? this.regions : 'World';

        this.lowIncome = this.lowIncome && this.lowIncome < val.data.poor ? val.data.poor : this.lowIncome;
        this.highIncome = this.highIncome && this.highIncome > val.data.rich ? val.data.rich : this.highIncome;

        if (this.lowIncome > this.highIncome) {
          this.lowIncome = val.data.poor;
        }

        this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;

        if (this.activeHouse) {
          this.query = this.query + `&activeHouse=${this.activeHouse}`;
        }

        if (this.matrixHeader) {
          this.matrixHeaderHeight = this.matrixHeader.offsetHeight;
        }

        if (this.matrixHeader && (this.activeHouse || this.row > 1 || Math.ceil(this.activeHouse / this.zoom) === this.row)) {
          this.guidePositionTop = this.matrixHeader.offsetHeight;
        }

        this.urlChanged({isInit: true});
      });

    this.headerFixedSubscribe = Observable
      .fromEvent(document, 'scroll')
      .subscribe(() => {
        this.zone.run(() => {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

          if (this.matrixHeader && this.windowInnerWidth > 599) {
            if (this.matrixHeader.offsetHeight > scrollTop) {
              this.guidePositionTop = scrollTop;
            }

            if (scrollTop > this.matrixHeader.offsetHeight && this.matrixHeader.offsetHeight !== this.guidePositionTop) {
              this.guidePositionTop = this.matrixHeader.offsetHeight;
            }

            // this.getPaddings();
          }

          if (this.windowInnerWidth < 600) {
            this.showMobileHeader();
          }

          if (this.isDesktop) {
            this.stopScroll();
          }
        });
      });

    if (!this.isDesktop) {
      this.scrollSubscribeForMobile = Observable
        .fromEvent(document, 'scroll')
        .debounceTime(150)
        .subscribe(() => {
          this.zone.run(() => {
            this.stopScroll();
          });
        });
    }
  }

  public interactiveIncomeText(): void {
    let thingContainer = this.element.querySelector('things-filter') as HTMLElement;
    let countriesFilter = this.element.querySelector('countries-filter') as HTMLElement;
    let filtersContainer = this.element.querySelector('.filters-container') as HTMLElement;
    let incomeContainer = this.element.querySelector('.income-title-container') as HTMLElement;
    let filtersBlockWidth: number = thingContainer.offsetWidth + countriesFilter.offsetWidth + 55;

    setTimeout((): void => {
      incomeContainer.classList.remove('incomeby');
    }, 0);

    if (filtersContainer.offsetWidth < (filtersBlockWidth + incomeContainer.offsetWidth)) {
      setTimeout((): void => {
        incomeContainer.classList.remove('incomeby');
      }, 0);
    }

    if ((filtersContainer.offsetWidth - filtersBlockWidth) > 75 && (filtersContainer.offsetWidth - filtersBlockWidth) < 150) {
      setTimeout((): void => {
        incomeContainer.classList.add('incomeby');
      }, 0);
    }
  }

  public ngOnDestroy(): void {
    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }

    if (this.headerFixedSubscribe) {
      this.headerFixedSubscribe.unsubscribe();
    }

    if (this.scrollSubscribeForMobile) {
      this.scrollSubscribeForMobile.unsubscribe();
    }

    this.resizeSubscribe.unsubscribe();
    this.queryParamsSubscribe.unsubscribe();
    this.matrixServiceSubscribe.unsubscribe();
    this.matrixServiceStreetSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }

  public ngAfterViewChecked(): void {
    let footer = document.querySelector('.footer') as HTMLElement;
    this.imgContent = this.element.querySelector('.image-content') as HTMLElement;

    if (!this.imgContent) {
      return;
    }

    let imageClientRect: ClientRect = this.imgContent.getBoundingClientRect();

    if (
      !this.element.querySelector('.image-content') || !imageClientRect.height ||
      this.imageHeight === imageClientRect.height &&
      this.footerHeight === footer.offsetHeight) {
      return;
    }

    this.imageHeight = imageClientRect.height;

    let imageMarginLeft: string = window.getComputedStyle(this.imgContent).getPropertyValue('margin-left');
    this.imageMargin = parseFloat(imageMarginLeft) * 2;

    this.footerHeight = footer.offsetHeight;

    this.setZoomButtonPosition();
    this.getPaddings();
  }

  /** each document usage breaks possible server side rendering */
  public stopScroll(): void {
    if (!this.imageHeight) {
      return;
    }

    if (isMobile) {
      let fixedStreet = this.element.querySelector('.street-container.fixed') as HTMLElement;

      if (fixedStreet) {
        this.getVisibleRows(fixedStreet.offsetHeight);
      }
    }

    this.setZoomButtonPosition();

    let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) - this.guidePositionTop;
    let distance = scrollTop / (this.imageHeight + this.imageMargin);

    if (isNaN(distance)) {
      return;
    }

    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.row = row + 1;

    if (this.rowEtalon !== this.row) {
      this.rowEtalon = this.row;
      let query = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;

      this.urlChangeService.replaceState('/matrix', query, true);
    }

    let clonePlaces = _.cloneDeep(this.filtredPlaces);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  public getPaddings(): void {
    let headerHeight: number = this.headerContainer.offsetHeight;
    let matrixImages = this.element.querySelector('matrix-images') as HTMLElement;

    matrixImages.style.paddingTop = `${headerHeight}px`;

    this.getVisibleRows(headerHeight);

    let scrollTo: number = (this.row - 1) * (this.imgContent.offsetHeight + this.imageMargin);

    if (this.activeHouse && Math.ceil(this.activeHouse / this.zoom) === this.row) {
      scrollTo = this.row * (this.imgContent.offsetHeight + this.imageMargin) - 60;
    }

    if (this.guidePositionTop) {
      scrollTo = scrollTo + this.guidePositionTop;
    }

    document.body.scrollTop = document.documentElement.scrollTop = scrollTo;

    if (this.clonePlaces && this.clonePlaces.length) {
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    }
  }

  public getVisibleRows(headerHeight: number): void {
    let viewable = this.windowInnerHeight - headerHeight;

    let distance = viewable / (this.imageHeight + this.imageMargin);
    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.visiblePlaces = row;

    this.clonePlaces = _.cloneDeep(this.filtredPlaces);
  }

  public hoverPlaceS(place: any): void {
    this.hoverPlace.next(place);
  }

  public urlChanged(options: any): void {
    this.zone.run(() => {
      let {url, isZoom, isInit, isBack} = options;

      if (url) {
        this.query = isZoom ? url.replace(/row\=\d*/, 'row=1') : url;
        this.row = isZoom ? this.row : 1;
      }

      if (!isInit && !isBack) {
        this.query = this.query.replace(/&activeHouse\=\d*/, '');
        this.activeHouse = void 0;

        this.hoverPlace.next(undefined);
        this.clearActiveHomeViewBox.next(true);
      }

      let parseQuery = this.parseUrl(this.query);
      this.thing = decodeURI(parseQuery.thing);
      this.loaderService.setLoader(false);

      if (this.matrixServiceSubscribe) {
        this.matrixServiceSubscribe.unsubscribe();
        this.matrixServiceSubscribe = void 0;
      }

      this.matrixServiceSubscribe = this.matrixService
        .getMatrixImages(this.query + `&resolution=${this.imageResolution.image}`)
        .subscribe((val: any) => {
          if (val.err) {
            console.error(val.err);
            return;
          }

          this.interactiveIncomeText();

          this.placesVal = val.data.zoomPlaces;
          this.streetPlacesData = val.data.streetPlaces;

          this.filtredPlaces = this.placesVal.filter((place: any): boolean => {
            return place;
          });

          this.matrixPlaces.next(this.filtredPlaces);
          this.placesArr = val.data.zoomPlaces;
          this.clonePlaces = _.cloneDeep(this.filtredPlaces);
          this.zoom = +parseQuery.zoom;

          if (!this.streetPlacesData.length) {
            this.streetPlaces.next([]);
            this.chosenPlaces.next([]);
            return;
          }

          let incomesArr = (_
            .chain(this.streetPlacesData)
            .map('income')
            .sortBy()
            .value()) as number[];

          this.streetPlaces.next(this.streetPlacesData);
          this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

          if (!this.filtredPlaces.length) {
            let lowIncome: number = Math.floor(incomesArr[0] - 10);
            let highIncome: number = Math.ceil(incomesArr[incomesArr.length - 1] + 10);

            this.query = this.query
              .replace(/lowIncome\=\d*/, `lowIncome=${lowIncome}`)
              .replace(/highIncome\=\d*/, `highIncome=${highIncome}`);

            this.lowIncome = lowIncome;
            this.highIncome = highIncome;
            this.urlChanged({url: this.query});
            return;
          }

          if (!this.filtredPlaces.length) {
            let matrixImages = this.element.querySelector('matrix-images') as HTMLElement;

            let headerHeight: number = this.headerContainer.offsetHeight;
            matrixImages.style.paddingTop = `${headerHeight}px`;
          }

          this.buildTitle(this.parseUrl(this.query));

          this.angulartics2GoogleAnalytics.eventTrack(`Change filters to thing=${this.thing} countries=${this.selectedCountries} regions=${this.selectedRegions} zoom=${this.zoom} incomes=${this.lowIncome} - ` + this.highIncome, {});

          if (!isBack) {
            this.urlChangeService.replaceState('/matrix', this.query);
          }

          if (document.body.scrollTop) {
            document.body.scrollTop = 0;
          } else {
            document.documentElement.scrollTop = 0;
          }
        });
    });
  }

  public buildTitle(query: any): any {
    let regions = query.regions.split(',');
    let countries = query.countries.split(',');

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = 'the world';

      return;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
      } else {
        this.activeCountries = countries.join(' & ');
      }

      this.selectedCountries = countries;

      return;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.activeCountries = countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
      } else {
        let sumCountries: number = 0;
        let difference: string[] = [];
        let regionCountries: string[] = [];

        _.forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.region) !== -1) {
            regionCountries = regionCountries.concat((_.map(location.countries, 'country')) as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          difference = _.difference(countries, regionCountries);
        }

        if (difference.length) {
          this.activeCountries = difference.length === 1 && regions.length === 1 ? regions[0] + ' & '
          + difference[0] : countries.slice(0, 2).join(', ') + ' (+' + (countries.length - 2) + ')';
        } else {
          this.activeCountries = regions.join(' & ');
        }
      }

      this.selectedRegions = regions;
      this.selectedCountries = countries;

      return;
    }

    let concatLocations: string[] = regions.concat(countries);

    if (concatLocations.length > 2) {
      this.activeCountries = concatLocations.slice(0, 2).join(', ') + ' (+' + (concatLocations.length - 2) + ')';
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
  }

  public activeHouseOptions(options: any): void {
    let {row, activeHouseIndex} = options;

    this.query = this.query.replace(/&activeHouse\=\d*/, '');

    if (row) {
      this.query = this.query.replace(/row\=\d*/, `row=${row}`);
    }

    if (activeHouseIndex) {
      this.activeHouse = activeHouseIndex;
      this.query = this.query + `&activeHouse=${activeHouseIndex}`;
    } else {
      this.activeHouse = void 0;
    }

    this.urlChangeService.replaceState('/matrix', this.query, true);
  }

  public changeZoom(zoom: any): void {
    this.urlChanged({
      url: this.query.replace(/zoom\=\d*/, `zoom=${zoom}`).replace(/row\=\d*/, `row=${this.row}`),
      isZoom: true
    });
  };

  protected startQuickGuide(): void {
    setTimeout(() => {
      this.getPaddings();
    }, 0);
  }

  protected openIncomeFilter(): void {
    if (!isMobile) {
      return;
    }

    this.isOpenIncomeFilter = true;
  }

  protected getResponseFromIncomeFilter(params: any): void {
    if (params.lowIncome && params.highIncome) {
      this.query = this.query
        .replace(/lowIncome\=\d*/, `lowIncome=${params.lowIncome}`)
        .replace(/highIncome\=\d*/, `highIncome=${params.highIncome}`);

      this.lowIncome = params.lowIncome;
      this.highIncome = params.highIncome;
      this.urlChanged({url: this.query});
    }

    this.isOpenIncomeFilter = false;
  }

  protected scrollTop(e: MouseEvent, element: HTMLElement): void {
    if (this.windowInnerWidth >= 600 || element.className.indexOf('fixed') === -1) {
      return;
    }

    e.preventDefault();

    Config.animateScroll('scrollBackToTop', 20, 1000);
  };

  private showMobileHeader(): void {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    if (scrollTop > this.headerContainer.offsetHeight - 10) {
      if (this.streetContainer.className.indexOf('fixed') !== -1) {
        return;
      }

      this.streetContainer.classList.add('fixed');
    } else {
      if (this.streetContainer.className.indexOf('fixed') === -1) {
        return;
      }

      this.streetContainer.classList.remove('fixed');
    }
  }

  private setZoomButtonPosition(): void {
    let scrollTop: number = (document.body.scrollTop || document.documentElement.scrollTop) + this.windowInnerHeight;
    let containerHeight: number = this.element.offsetHeight + 30;

    this.zone.run(() => {
      this.zoomPositionFixed = scrollTop > containerHeight;
    });
  }

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
