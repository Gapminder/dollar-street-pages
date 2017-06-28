import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import {
  Component,
  ElementRef,
  OnDestroy,
  NgZone,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { chain, cloneDeep, find, map, difference, forEach } from 'lodash';
import {
  LoaderService,
  UrlChangeService,
  Angulartics2GoogleAnalytics,
  BrowserDetectionService,
  LanguageService,
  ActiveThingService,
  UtilsService,
  DrawDividersInterface
} from '../common';
import {
  GuideComponent,
} from '../shared';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { MatrixService } from './matrix.service';
import { MatrixImagesComponent } from './matrix-images/matrix-images.component';
import { ImageResolutionInterface } from '../interfaces';

@Component({
  selector: 'matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(MatrixImagesComponent)
  public matrixImagesComponent: MatrixImagesComponent;
  @ViewChild(GuideComponent)
  public guideComponent: GuideComponent;
  @ViewChild('streetAndTitleContainer')
  public streetAndTitleContainer: ElementRef;
  @ViewChild('streetContainer')
  public streetContainer: ElementRef;
  @ViewChild('matrixHeader')
  public headerContainer: ElementRef;

  public headerContainerElement: HTMLElement;
  public streetContainerElement: HTMLElement;
  public streetAndTitleContainerElement: HTMLElement;
  public zoomPositionFixed: boolean;
  public isOpenIncomeFilter: boolean = false;
  public isMobile: boolean;
  public isDesktop: boolean;
  public window: Window = window;
  public hoverPlace: Subject<any> = new Subject<any>();
  public streetPlaces: Subject<any> = new Subject<any>();
  public matrixPlaces: Subject<any> = new Subject<any>();
  public chosenPlaces: Subject<any> = new Subject<any>();
  public clearActiveHomeViewBox: Subject<any> = new Subject<any>();
  public row: number;
  public zoom: number;
  public lowIncome: number;
  public highIncome: number;
  public activeHouse: number;
  public imageHeight: number;
  public imageMargin: number;
  public footerHeight: number;
  public visiblePlaces: number;
  public rowEtalon: number = 0;
  public windowInnerWidth: number = window.innerWidth;
  public windowInnerHeight: number = window.innerHeight;
  public placesVal: any;
  public locations: any;
  public countriesTranslations: any[];
  public streetData: DrawDividersInterface;
  public selectedRegions: any;
  public activeCountries: any;
  public streetPlacesData: any;
  public selectedCountries: any;
  public placesArr: any[];
  public clonePlaces: any[];
  public filtredPlaces: any[] = [];
  public windowHistory: any = history;
  public scrollSubscribeForMobile: Subscription;
  public resizeSubscribe: Subscription;
  public queryParamsSubscribe: Subscription;
  public headerFixedSubscribe: Subscription;
  public matrixServiceSubscribe: Subscription;
  public thing: string;
  public activeThing: any;
  public query: string;
  public regions: string;
  public countries: string;
  public zone: NgZone;
  public ref: ChangeDetectorRef;
  public router: Router;
  public matrixService: MatrixService;
  public loaderService: LoaderService;
  public utilsService: UtilsService;
  public activatedRoute: ActivatedRoute;
  public urlChangeService: UrlChangeService;
  public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics;
  public element: HTMLElement;
  public imageResolution: ImageResolutionInterface;
  public matrixImagesContainer: HTMLElement;
  public imagesContainer: HTMLElement;
  public matrixImagesContainerHeight: number;
  public locationStrategy: LocationStrategy;
  public guidePositionTop: number = 0;
  public imageContentElement: HTMLElement;
  public guideContainer: HTMLElement;
  public guideHeight: number;
  public device: BrowserDetectionService;
  public languageService: LanguageService;
  public theWorldTranslate: string;
  public activeThingService: ActiveThingService;
  public getTranslationSubscribe: Subscription;
  public byIncomeText: string;
  public store: Store<AppState>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public countriesFilterState: Observable<any>;

  public constructor(zone: NgZone,
                     router: Router,
                     activatedRoute: ActivatedRoute,
                     element: ElementRef,
                     locationStrategy: LocationStrategy,
                     matrixService: MatrixService,
                     loaderService: LoaderService,
                     urlChangeService: UrlChangeService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     languageService: LanguageService,
                     activeThingService: ActiveThingService,
                     ref: ChangeDetectorRef,
                     utilsService: UtilsService,
                     store: Store<AppState>) {
    this.ref = ref;
    this.zone = zone;
    this.router = router;
    this.locationStrategy = locationStrategy;
    this.activatedRoute = activatedRoute;
    this.matrixService = matrixService;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.urlChangeService = urlChangeService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
    this.languageService = languageService;
    this.activeThingService = activeThingService;
    this.utilsService = utilsService;
    this.store = store;

    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((dataSet: AppState) => dataSet.streetSettings);
    this.countriesFilterState = this.store.select((dataSet: AppState) => dataSet.countriesFilter);
  }

  public ngAfterViewInit(): void {
    this.matrixImagesContainer = this.matrixImagesComponent.element;
    this.guideContainer = this.guideComponent.element;
    this.headerContainerElement = this.headerContainer.nativeElement;
    this.streetContainerElement = this.streetContainer.nativeElement;
    this.streetAndTitleContainerElement = this.streetAndTitleContainer.nativeElement;

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD', 'BY_INCOME']).subscribe((trans: any) => {
      this.theWorldTranslate = trans.THE_WORLD;
      this.byIncomeText = trans.BY_INCOME;
    });

    this.activeThingService.activeThingEmitter.subscribe((thing: any) => {
      this.activeThing = thing;
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          if (window.innerWidth === this.windowInnerWidth) {
            return;
          }

          if (this.guideContainer) {
            this.guideHeight = this.guideContainer.offsetHeight;
          }

          this.windowInnerHeight = window.innerHeight;
          this.windowInnerWidth = window.innerWidth;

          this.interactiveIncomeText();
        });
      });

    this.locationStrategy.onPopState(() => {
      if (this.streetData && this.locations) {
        this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;
        this.query = this.query + this.languageService.getLanguageParam();
        this.urlChanged({isBack: true});

        if (this.guideContainer) {
          this.guideHeight = this.guideContainer.offsetHeight;
        }

        if (this.guideContainer && (this.activeHouse || this.row > 1 || Math.ceil(this.activeHouse / this.zoom) === this.row)) {
          this.guidePositionTop = this.guideContainer.offsetHeight;
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

        this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
          this.streetData = data;

          if (this.streetData) {
            this.initData();
          }
        });
      });

      this.countriesFilterState.subscribe((data: any) => {
        this.locations = data;

        this.countriesTranslations = chain(data)
          .map('countries')
          .flatten()
          .sortBy('country')
          .value();
      });

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.headerFixedSubscribe = fromEvent(document, 'scroll')
      .subscribe(() => {
        this.zone.run(() => {
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

          if (this.guideContainer && this.guideContainer.offsetHeight && !this.isMobile && this.imageContentElement) {
            if (this.guideContainer.offsetHeight > scrollTop) {
              this.guidePositionTop = scrollTop;
              this.getPaddings({isGuide: true});
            }

            if (scrollTop > this.guideContainer.offsetHeight && this.guideContainer.offsetHeight !== this.guidePositionTop) {
              this.guidePositionTop = this.guideContainer.offsetHeight;
              this.getPaddings({isGuide: true});
            }
          }

          let headerHeight: number = this.headerContainerElement.clientHeight;

          if (scrollTop > headerHeight) {
            this.headerContainerElement.style.position = 'fixed';
            this.matrixImagesContainer.style.paddingTop = this.headerContainerElement.clientHeight + 'px';
          } else {
            this.headerContainerElement.style.position = 'static';
            this.matrixImagesContainer.style.paddingTop = '0px';
          }

          if (this.isMobile) {
            this.showMobileHeader();
          }

          if (this.isDesktop) {
            this.stopScroll();
          }
        });
      });

    if (!this.isDesktop) {
      this.scrollSubscribeForMobile = fromEvent(document, 'scroll')
        .debounceTime(150)
        .subscribe(() => {
          this.zone.run(() => {
            this.stopScroll();
          });
        });
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

    this.getTranslationSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();
    this.queryParamsSubscribe.unsubscribe();
    this.matrixServiceSubscribe.unsubscribe();
    this.loaderService.setLoader(false);
  }

  public ngAfterViewChecked(): void {
    this.zone.run(() => {
      if (!this.matrixImagesComponent.imageContent) {
        return;
      }

      this.imageContentElement = this.matrixImagesComponent.imageContent.nativeElement;

      if (!this.imageContentElement) {
        return;
      }

      if (this.matrixImagesContainerHeight !== this.matrixImagesContainer.offsetHeight) {
        this.matrixImagesContainerHeight = this.matrixImagesContainer.offsetHeight;
        this.setZoomButtonPosition();
      }

      let imageClientRect: ClientRect = this.imageContentElement.getBoundingClientRect();

      if (!imageClientRect.height ||
          this.imageHeight === imageClientRect.height &&
          this.guideHeight === this.guideContainer.offsetHeight) {
          return;
      }

      this.imageHeight = imageClientRect.height;

      let imageMarginLeft: string = window.getComputedStyle(this.imageContentElement).getPropertyValue('margin-left');
      this.imageMargin = parseFloat(imageMarginLeft) * 2;

      let footer = document.querySelector('.footer') as HTMLElement;
      this.footerHeight = footer.offsetHeight;

      setTimeout(() => {
        this.guideHeight = this.guideContainer.offsetHeight;
      }, 0);

      if (this.row === 1) {
        setTimeout(() => {
          this.getPaddings({});
          return;
        }, 0);
      }

      if (!this.activeHouse && this.row < 2) {
        setTimeout(() => {
          this.guidePositionTop = 0;
          this.getPaddings({});
          return;
        }, 0);
      }
      this.getPaddings({});
    });
  }

  public initData(): void {
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

    this.lowIncome = this.lowIncome && this.lowIncome < this.streetData.poor ? this.streetData.poor : this.lowIncome;
    this.highIncome = this.highIncome && this.highIncome > this.streetData.rich ? this.streetData.rich : this.highIncome;

    if (this.lowIncome > this.highIncome) {
      this.lowIncome = this.streetData.poor;
    }

    this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;
    this.query = this.query + this.languageService.getLanguageParam();

    if (this.activeHouse) {
      this.query = this.query + `&activeHouse=${this.activeHouse}`;
    }

    if (this.guideContainer) {
      this.guideHeight = this.guideContainer.offsetHeight;
    }

    if (this.guideContainer && (this.activeHouse || this.row > 1 || Math.ceil(this.activeHouse / this.zoom) === this.row)) {
      this.guidePositionTop = this.guideContainer.offsetHeight;
    }

    this.urlChanged({isInit: true});
  }

  public interactiveIncomeText(): void {
    let incomeContainer: HTMLElement = this.element.querySelector('.income-title-container') as HTMLElement;

    setTimeout(() => {
      incomeContainer.classList.remove('incomeby');
    }, 0);

    if (this.byIncomeText.length > 20 && this.window.innerWidth < 920) {
      setTimeout(() => {
        incomeContainer.classList.add('incomeby');
      },0);
    }
  }

  /** each document usage breaks possible server side rendering */
  public stopScroll(): void {
    if (this.isMobile) {
      let fixedStreet: HTMLElement = this.streetContainerElement.classList.contains('fixed') ? this.streetContainerElement : undefined;

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

    let clonePlaces = cloneDeep(this.filtredPlaces);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  public getPaddings(options: { isGuide?: boolean }): void {
    if (!this.imageContentElement) {
      return;
    }

    let {isGuide} = options;

    let headerHeight: number = this.headerContainerElement.offsetHeight;

    if (this.guideContainer) {
      headerHeight -= this.guidePositionTop;
    }

    this.getVisibleRows(headerHeight);

    let scrollTo: number = (this.row - 1) * (this.imageContentElement.offsetHeight + this.imageMargin);

    if (this.activeHouse && Math.ceil(this.activeHouse / this.zoom) === this.row) {
      scrollTo = this.row * (this.imageContentElement.offsetHeight + this.imageMargin) - 60;
    }

    if (this.guidePositionTop || this.guidePositionTop === 0) {
      scrollTo = scrollTo + this.guidePositionTop;
    }

    if (!isGuide) {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTo;
    }

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

    this.clonePlaces = cloneDeep(this.filtredPlaces);
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
          this.clonePlaces = cloneDeep(this.filtredPlaces);
          this.zoom = +parseQuery.zoom;

          if (!this.streetPlacesData.length) {
            this.streetPlaces.next([]);
            this.chosenPlaces.next([]);
            return;
          }

          let incomesArr = (chain(this.streetPlacesData)
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

          this.buildTitle(this.query);

          if (!isBack) {
            this.urlChangeService.replaceState('/matrix', this.query);
          }

          if (document.body.scrollTop) {
            document.body.scrollTop = 0;
          } else {
            document.documentElement.scrollTop = 0;
          }

          this.angulartics2GoogleAnalytics.eventTrack(`Change filters to thing=${this.thing} countries=${this.selectedCountries} regions=${this.selectedRegions} zoom=${this.zoom} incomes=${this.lowIncome} - ` + this.highIncome, {});
        });
    });
  }

  public activeHouseOptions(options: any): void {
    let {row, activeHouseIndex} = options;
    let queryParams: any = this.parseUrl(this.query);

    delete queryParams.activeHouse;

    if (row) {
      queryParams.row = row;
    }

    if (activeHouseIndex) {
      this.activeHouse = activeHouseIndex;
      queryParams.activeHouse = activeHouseIndex;
    } else {
      this.activeHouse = void 0;
    }

    if (!queryParams.lang) {
      queryParams.lang = this.languageService.currentLanguage;
    }

    this.query = this.utilsService.objToQuery(queryParams);

    this.urlChangeService.replaceState('/matrix', this.query, true);
  }

  public changeZoom(zoom: any): void {
    this.urlChanged({
     url: this.query.replace(/zoom\=\d*/, `zoom=${zoom}`).replace(/row\=\d*/, `row=${this.row}`),
     isZoom: true
    });
  }

  public startQuickGuide(): void {
    setTimeout(() => {
      this.getPaddings({});
    }, 0);
  }

  public openIncomeFilter(): void {
    if (!this.isMobile) {
      return;
    }

    this.isOpenIncomeFilter = true;
  }

  public getResponseFromIncomeFilter(params: any): void {
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

  public scrollTop(e: MouseEvent, element: HTMLElement): void {
    if (this.windowInnerWidth >= 600 || element.className.indexOf('fixed') === -1) {
      return;
    }

    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };

  public showMobileHeader(): void {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    this.guidePositionTop = 0;

    this.imagesContainer = this.matrixImagesComponent.imagesContainer.nativeElement;

    if (scrollTop > this.headerContainerElement.clientHeight) {
      if (this.streetContainerElement.className.indexOf('fixed') !== -1) {
        return;
      }

      this.streetContainerElement.classList.add('fixed');
      this.streetAndTitleContainerElement.style.position = 'fixed';
      this.streetAndTitleContainerElement.style.zIndex = '1000';
      this.imagesContainer.style.paddingTop = this.streetContainerElement.clientHeight * 2 + 'px';

      if (this.guideContainer) {
        this.headerContainerElement.style.marginTop = '-' + this.guideContainer.clientHeight + 'px';
      }
    } else {
      if (this.streetContainerElement.className.indexOf('fixed') === -1) {
        return;
      }

      this.streetContainerElement.classList.remove('fixed');
      this.streetAndTitleContainerElement.style.position = 'static';
      this.streetAndTitleContainerElement.style.zIndex = '1';
      this.imagesContainer.style.paddingTop = '0px';

      if (this.guideContainer) {
        this.headerContainerElement.style.marginTop = '0px';
      }
    }
  }

  public setZoomButtonPosition(): void {
    let scrollTop: number = (document.body.scrollTop || document.documentElement.scrollTop) + this.windowInnerHeight;
    let containerHeight: number = this.element.offsetHeight + 30;
    this.zoomPositionFixed = scrollTop > containerHeight;
    this.ref.detectChanges();
  }

  public parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  public findCountryTranslatedName(countries: any[]): any {
    return map(countries, (item: string): any => {
      const findTransName: any = find(this.countriesTranslations, {originName: item});
      return findTransName ? findTransName.country : item;

    });
  }

  public findRegionTranslatedName(regions: any[]): any {
    return map(regions, (item: string): any => {
      const findTransName: any = find(this.locations, {originRegionName: item});
      return findTransName ? findTransName.region : item;
    });
  }

  public parseLocations(url: string): any {
    let urlForParse = ('{\"' + url.replace(/&/g, '\",\"') + '\"}').replace(/=/g, '\":\"');
    let query = JSON.parse(urlForParse);

    query.regions = query.regions.split(',');
    query.countries = query.countries.split(',');

    return query;
  }

  public buildTitle(url: any): any {
    let query: any = this.parseLocations(url);
    let regions: string[] = query.regions;
    let countries: string[] = query.countries;
    let getTranslatedCountries: any;
    let getTranslatedRegions: any;

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = this.theWorldTranslate;

      return;
    }

    if (query.countries[0] !== 'World') {
      getTranslatedCountries = this.findCountryTranslatedName(query.countries);
    }

    if (query.regions[0] !== 'World') {
      getTranslatedRegions = this.findRegionTranslatedName(query.regions);
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = `${getTranslatedCountries.slice(0, 2).join(', ')} (+${getTranslatedCountries.length - 2})`;
      } else {
        this.activeCountries = getTranslatedCountries.join(' & ');
      }

      this.selectedCountries = countries;

      return;
    }

    if (regions[0] !== 'World') {
      if (regions.length > 2) {
        this.activeCountries = `${getTranslatedCountries.slice(0, 2).join(', ')} (+${getTranslatedCountries.length - 2})`;
      } else {
        let sumCountries: number = 0;
        let countriesDiff: string[] = [];
        let regionCountries: string[] = [];

        forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.originRegionName) !== -1) {
            regionCountries = regionCountries.concat((map(location.countries, 'country')) as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          countriesDiff = difference(getTranslatedCountries, regionCountries);
        }

        if (countriesDiff.length) {
          this.activeCountries = countriesDiff.length === 1 && regions.length === 1 ? getTranslatedRegions[0] + ' & '
            + countriesDiff[0] : `${getTranslatedCountries.slice(0, 2).join(', ')} (+${getTranslatedCountries.length - 2})`;
        } else {
          this.activeCountries = getTranslatedRegions.join(' & ');
        }
      }

      this.selectedRegions = regions;
      this.selectedCountries = countries;

      return;
    }

    let concatLocations: string[] = regions.concat(getTranslatedCountries);

    if (concatLocations.length > 2) {
      this.activeCountries = `${concatLocations.slice(0, 2).join(', ')} (+${concatLocations.length - 2})`;
    } else {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
  }
}
