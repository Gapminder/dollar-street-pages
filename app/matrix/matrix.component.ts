import { Component, OnInit, Inject, ElementRef, OnDestroy, AfterViewChecked, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscriber, Subscription } from 'rxjs/Rx';
import { MatrixImagesComponent } from './matrix-images/matrix-images.component';
import { StreetComponent } from '../common/street/street.component';
import { StreetMobileComponent } from '../common/street-mobile/street-mobile.component';
import { FooterComponent } from '../common/footer/footer.component';
import { FloatFooterComponent } from '../common/footer-floating/footer-floating.component';
import { HeaderComponent } from '../common/header/header.component';
import { LoaderComponent } from '../common/loader/loader.component';
import { GuideComponent } from '../common/guide/guide.component';
import { FooterSpaceDirective } from '../common/footer-space/footer-space.directive';
import { Config, ImageResolutionInterface } from '../app.config';

let _ = require('lodash');
let device = require('device.js')();

let tpl = require('./matrix.template.html');
let style = require('./matrix.css');

@Component({
  selector: 'matrix',
  template: tpl,
  styles: [style],
  directives: [
    GuideComponent,
    HeaderComponent,
    StreetComponent,
    StreetMobileComponent,
    MatrixImagesComponent,
    FooterComponent,
    FloatFooterComponent,
    FooterSpaceDirective,
    LoaderComponent]
})

export class MatrixComponent implements OnInit, OnDestroy, AfterViewChecked {
  protected filtredPlaces: any[] = [];
  protected zoomPositionFixed: boolean = false;
  public clearActiveHomeViewBox: Subject<any> = new Subject<any>();

  public query: string;
  public matrixService: any;
  public streetPlaces: Subject<any> = new Subject<any>();
  public matrixPlaces: Subject<any> = new Subject<any>();
  public chosenPlaces: Subject<any> = new Subject<any>();
  public hoverPlace: Subject<any> = new Subject<any>();
  public padding: Subject<any> = new Subject<any>();
  public loader: boolean = false;
  public lowIncome: number;
  public highIncome: number;
  public matrixServiceSubscribe: Subscriber<any>;
  public Angulartics2GoogleAnalytics: any;
  public streetData: any;
  public selectedCountries: any;
  public selectedRegions: any;

  private resizeSubscribe: Subscription;
  private placesArr: any[];
  private element: HTMLElement;
  private rowEtalon: number = 0;
  private imageHeight: number;
  private footerHeight: number;
  private imageMargin: number;
  private visiblePlaces: number;
  private urlChangeService: any;
  private router: Router;
  private thing: string;
  private countries: string;
  private regions: string;
  private row: number;
  private activeHouse: number;
  private placesVal: any;
  private zoom: number;
  private locations: any;
  private isDesktop: boolean = device.desktop();
  private clonePlaces: any[];
  private zone: NgZone;
  private countriesFilterService: any;
  private countriesFilterServiceSubscribe: any;
  private windowHistory: any = history;
  private matrixServiceStreetSubscribe: Subscriber<any>;
  private streetPlacesData: any;
  private queryParamsSubscribe: Subscription;
  private windowInnerHeight: number = window.innerHeight;
  private imageResolution: ImageResolutionInterface;

  public constructor(@Inject('MatrixService') matrixService: any,
                     @Inject(ElementRef) element: ElementRef,
                     @Inject('CountriesFilterService') countriesFilterService: any,
                     @Inject('UrlChangeService') urlChangeService: any,
                     @Inject(Router) router: Router,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any,
                     @Inject(NgZone) zone: NgZone) {
    this.matrixService = matrixService;
    this.element = element.nativeElement;
    this.router = router;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
    this.urlChangeService = urlChangeService;
    this.countriesFilterService = countriesFilterService;
    this.zone = zone;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerHeight = window.innerHeight;

          this.interactiveIncomeText();
        });
      });

    this.queryParamsSubscribe = this.router
      .routerState
      .queryParams
      .subscribe((params: any) => {
        this.thing = params.thing || 'Families';
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

        let windowInnerWidth: number = window.innerWidth;

        if (!this.isDesktop && windowInnerWidth > 767) {
          this.zoom = 3;
        }

        if (!this.isDesktop && windowInnerWidth <= 767) {
          this.zoom = 2;
        }

        this.row = this.activeHouse ? Math.ceil(this.activeHouse / this.zoom) : this.row;

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

        this.urlChanged({isInit: true});

        document.onscroll = () => {
          this.stopScroll();
        };
      });

    this.imageResolution = Config.getImageResolution();
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

    if ((filtersContainer.offsetWidth - filtersBlockWidth) > 75 && (filtersContainer.offsetWidth - filtersBlockWidth) < 175) {
      setTimeout((): void => {
        incomeContainer.classList.add('incomeby');
      }, 0);
    }
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }

    document.onscroll = void 0;
    this.matrixServiceSubscribe.unsubscribe();
    this.matrixServiceStreetSubscribe.unsubscribe();
    this.queryParamsSubscribe.unsubscribe();
  }

  public ngAfterViewChecked(): void {
    let footer = this.element.querySelector('.footer') as HTMLElement;
    let imgContent = this.element.querySelector('.image-content') as HTMLElement;

    if (!imgContent) {
      return;
    }

    if (this.footerHeight === footer.offsetHeight &&
      this.imageHeight === imgContent.offsetHeight || !this.element.querySelector('.image-content')) {

      return;
    }

    this.imageHeight = imgContent.offsetHeight;
    this.footerHeight = footer.offsetHeight;

    this.setZoomButtonPosition();
    this.getPaddings();
  }

  /** each document usage breaks possible server side rendering */
  public stopScroll(): void {
    this.setZoomButtonPosition();
    let scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    let distance = scrollTop / (this.imageHeight + 2 * this.imageMargin);

    if (isNaN(distance)) {
      return;
    }

    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.65) {
      row++;
    }

    this.row = row + 1;

    if (this.rowEtalon !== this.row) {
      this.rowEtalon = this.row;
      let query = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;

      this.urlChangeService.replaceState(`/matrix`, query);
    }

    let clonePlaces = _.cloneDeep(this.filtredPlaces);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  public getPaddings(): void {
    let windowInnerWidth = window.innerWidth - 34;
    let header = this.element.querySelector('.matrix-header') as HTMLElement;
    this.imageMargin = (windowInnerWidth - this.imageHeight * this.zoom) / (2 * this.zoom);

    /** se content\view child\childer */

    let matrixImages = this.element.querySelector('matrix-images') as HTMLElement;
    let imageContainer = this.element.querySelector('.image-content') as HTMLElement;

    if (!imageContainer) {
      return;
    }

    matrixImages.style.paddingTop = `${header.offsetHeight}px`;

    this.getViewableRows(header.offsetHeight);

    this.row = this.activeHouse ? Math.ceil(this.activeHouse / this.zoom) : this.row;

    let scrollTo: number = (this.row - 1) * (imageContainer.offsetHeight + 2 * this.imageMargin);

    if (this.activeHouse) {
      scrollTo = this.row * (imageContainer.offsetHeight + 2 * this.imageMargin) - 60;
    }

    document.body.scrollTop = document.documentElement.scrollTop = scrollTo;

    if (this.clonePlaces) {
      this.streetPlaces.next(this.streetPlacesData);
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    }
  }

  public getViewableRows(headerHeight: number): void {
    let viewable = this.windowInnerHeight - headerHeight;
    let distance = viewable / (this.imageHeight + 2 * this.imageMargin);
    let rest = distance % 1;
    let row = distance - rest;
    if (rest >= 0.65) {
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
      let {url, isZoom, isCountriesFilter, isInit} = options;

      if (url) {
        this.query = isZoom ? url.replace(/row\=\d*/, 'row=1') : url;
        this.row = isZoom ? this.row : 1;
      }

      if (!isInit) {
        this.query = this.query.replace(/&activeHouse\=\d*/, '');
        this.activeHouse = void 0;
        this.hoverPlace.next(undefined);
        this.clearActiveHomeViewBox.next(true);
      }

      let parseQuery = this.parseUrl(this.query);
      this.thing = parseQuery.thing;
      this.loader = false;

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
          this.loader = true;

          let incomesArr = _
            .chain(this.streetPlacesData)
            .map('income')
            .sortBy()
            .value();

          this.streetPlaces.next(this.streetPlacesData);
          this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

          if (!this.filtredPlaces.length && isCountriesFilter && (Number(parseQuery.lowIncome) !== this.streetData.poor || Number(parseQuery.highIncome) !== this.streetData.rich)) {
            this.query = this.query
              .replace(/lowIncome\=\d*/, `lowIncome=${Math.floor(incomesArr[0] - 10)}`)
              .replace(/highIncome\=\d*/, `highIncome=${Math.ceil(incomesArr[incomesArr.length - 1] + 10)}`);

            this.urlChanged({url: this.query});
          }
          let dataForTitle = this.parseUrl(this.query);
          this.buildTitle(dataForTitle);
          this.Angulartics2GoogleAnalytics.eventTrack(`Change filters to ` + `thing=` + dataForTitle.thing + ` countries=` + this.selectedCountries
            + ` regions=` + this.selectedRegions + ` zoom=` + dataForTitle.zoom + ` incomes=` + dataForTitle.lowIncome + `-` + dataForTitle.highIncome);
          this.urlChangeService.replaceState('/matrix', this.query);

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
    let title: any;
    let concatData: any;
    if (regions[0] === 'World' && countries[0] === 'World') {
      this.selectedCountries = countries[0];
      this.selectedRegions = regions[0];
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length < 2) {
        title = countries.join(' & ');
      } else {
        title = countries;
      }
      this.selectedCountries = title;
      this.selectedRegions = regions[0];
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.selectedCountries = countries;
      } else {
        let sumCountries: number = 0;
        let difference: string[] = [];
        let regionCountries: string[] = [];

        _.forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.region) !== -1) {
            regionCountries = regionCountries.concat(_.map(location.countries, 'country'));
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          difference = _.difference(countries, regionCountries);
        }

        if (difference.length) {
          title = difference.length === 1 && regions.length === 1 ? regions[0] + ' & '
          + difference[0] : regions;
        } else {
          title = regions.join(' & ');
        }
      }
      this.selectedRegions = title;
    }

    let concatLocations: string[] = countries;
    if (concatLocations.length > 2) {
      concatData = concatLocations;
    } else {
      concatData = concatLocations.join(' & ');
    }
    this.selectedCountries = concatData;

  }

  public activeHouseOptions(options: any): void {
    let {row, activeHouseIndex} = options;

    this.query = this.query.replace(/row\=\d*/, `row=${row}`).replace(/&activeHouse\=\d*/, '');

    if (activeHouseIndex) {
      this.activeHouse = activeHouseIndex;
      this.query = this.query + `&activeHouse=${activeHouseIndex}`;
    } else {
      this.activeHouse = void 0;
    }

    this.urlChangeService.replaceState('/matrix', this.query);
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

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  private setZoomButtonPosition(): void {
    let scrollTop: number = (document.body.scrollTop || document.documentElement.scrollTop) + this.windowInnerHeight;
    let containerHeight: number = this.element.offsetHeight - this.footerHeight + 45;

    this.zone.run(() => {
      this.zoomPositionFixed = scrollTop > containerHeight;
    });
  }
}
