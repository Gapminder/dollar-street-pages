import 'rxjs/add/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppStates } from '../interfaces';
import * as StreetSettingsActions from '../common';
import {
  Component,
  ElementRef,
  OnDestroy,
  NgZone,
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
  UtilsService,
  DrawDividersInterface,
  MathService,
  ImageGeneratorService,
  SocialShareService,
  SortPlacesService
} from '../common';
import * as AppActions from '../app/ngrx/app.actions';
import * as MatrixActions from './ngrx/matrix.actions';
import * as ThingsFilterActions from '../shared/things-filter/ngrx/things-filter.actions';
import { MatrixImagesComponent } from './matrix-images/matrix-images.component';
import { ImageResolutionInterface } from '../interfaces';
import { MatrixService } from './matrix.service';

@Component({
  selector: 'matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatrixImagesComponent)
  public matrixImagesComponent: MatrixImagesComponent;
  @ViewChild('streetAndTitleContainer')
  public streetAndTitleContainer: ElementRef;
  @ViewChild('streetContainer')
  public streetContainer: ElementRef;
  @ViewChild('matrixHeader')
  public matrixHeader: ElementRef;

  public matrixHeaderElement: HTMLElement;
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
  public itemSize: number;
  public footerHeight: number;
  public visiblePlaces: number;
  public rowEtalon: number = 0;
  public windowInnerWidth: number = window.innerWidth;
  public windowInnerHeight: number = window.innerHeight;
  public locations: any;
  public countriesTranslations: any[];
  public streetData: DrawDividersInterface;
  public selectedRegions: any;
  public activeCountries: any;
  public selectedCountries: any;
  public placesArr: any[];
  public clonePlaces: any[];
  // public filtredPlaces: any[] = [];
  public shownPlaces: any[];
  public windowHistory: any = history;
  public scrollSubscribtion: Subscription;
  public resizeSubscribe: Subscription;
  public queryParamsSubscribe: Subscription;
  public thing: string;
  public query: string;
  public regions: string;
  public countries: string;
  public zone: NgZone;
  public router: Router;
  public loaderService: LoaderService;
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
  public guideContainerElement: HTMLElement;
  public device: BrowserDetectionService;
  public theWorldTranslate: string;
  public getTranslationSubscribe: Subscription;
  public byIncomeText: string;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public appState: Observable<any>;
  public matrixState: Observable<any>;
  public headerElement: HTMLElement;
  public isInit: boolean;
  public streetSettingsStateSubscription: Subscription;
  public appStateSubscription: Subscription;
  public matrixStateSubscription: Subscription;
  public isQuickGuideOpened: boolean;
  public thingsFilterState: Observable<any>;
  public thingsFilterStateSubscription: Subscription;
  public isPinMode: boolean;
  public isPinCollapsed: boolean;
  public pinContainerElement: HTMLElement;
  public placesSet: Array<any>;
  public pinItemSize: number;
  public maxPinnedCount: number = 6;
  public pinHeaderTitle: string;
  public isPreviewView: boolean;
  public isEmbedView: boolean;
  public embedSetId: string;
  public isEmbedShared: boolean;
  public activeThing: any;
  public imagesProcessed: boolean;
  public matrixImages: any;
  public countriesFilterState: Observable<any>;
  public countriesFilterStateSubscription: Subscription;
  public isScreenshotProcessing: boolean;
  public timeUnit: string;
  public currencyUnit: any;
  public currencyUnits: any[];
  public streetPlacesData: any;

  public constructor(zone: NgZone,
                     router: Router,
                     activatedRoute: ActivatedRoute,
                     element: ElementRef,
                     locationStrategy: LocationStrategy,
                     loaderService: LoaderService,
                     urlChangeService: UrlChangeService,
                     browserDetectionService: BrowserDetectionService,
                     angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private languageService: LanguageService,
                     private changeDetectorRef: ChangeDetectorRef,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private math: MathService,
                     private matrixService: MatrixService,
                     private imageGeneratorService: ImageGeneratorService,
                     private socialShareService: SocialShareService,
                     private sortPlacesService: SortPlacesService) {
    this.zone = zone;
    this.router = router;
    this.locationStrategy = locationStrategy;
    this.activatedRoute = activatedRoute;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.urlChangeService = urlChangeService;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;

    this.isMobile = this.device.isMobile();
    this.isDesktop = this.device.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
    this.thingsFilterState = this.store.select((appStates: AppStates) => appStates.thingsFilter);
    this.countriesFilterState = this.store.select((appStates: AppStates) => appStates.countriesFilter);
  }

  public ngAfterViewInit(): void {
    this.headerElement = document.querySelector('.header-content') as HTMLElement;

    this.matrixImagesContainer = this.matrixImagesComponent.element;
    this.matrixHeaderElement = this.matrixHeader.nativeElement;
    this.streetContainerElement = this.streetContainer.nativeElement;
    this.streetAndTitleContainerElement = this.streetAndTitleContainer.nativeElement;

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD']).subscribe((trans: any) => {
      this.theWorldTranslate = trans.THE_WORLD;
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          if (this.query !== data.query) {
            this.query = data.query;
          }
        }
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.pinMode) {
          this.isPinMode = true;
          this.isEmbedView = false;
        } else {
          this.isPinMode = false;
          this.isEmbedShared = false;
          this.isPreviewView = false;

          if (this.isPinCollapsed) {
            this.store.dispatch(new MatrixActions.SetPinCollapsed(false));
          }
        }

        if (data.pinCollapsed) {
          this.isPinCollapsed = true;
        } else {
          this.isPinCollapsed = false;
        }

        if (data.timeUnit) {
          if (this.timeUnit !== data.timeUnit) {
            this.timeUnit = data.timeUnit;
            this.changeTimeUnit(data.timeUnit);
          }
        }

        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
            this.changeCurrencyUnit(data.currencyUnit);
          }
        }

        if (data.currencyUnits) {
          if (this.currencyUnits !== data.currencyUnits) {
            this.currencyUnits = data.currencyUnits;
            this.setCurrencyForLang();
          }
        }

        if (data.incomeFilter) {
          this.isOpenIncomeFilter = true;
        } else {
          this.isOpenIncomeFilter = false;
        }

        if (data.quickGuide) {
          this.isQuickGuideOpened = true;

          this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
        } else {
          this.isQuickGuideOpened = false;
        }

        if (data.placesSet) {
          if (this.placesSet !== data.placesSet) {
            this.placesSet = data.placesSet;

            if (!this.isPinMode && this.placesSet.length) {
              this.isEmbedView = true;
            }

            this.pinItemSize = this.matrixImagesContainer.offsetWidth / this.maxPinnedCount;

            this.setPinHeaderTitle();
          }
        }

        if (data.matrixImages) {
          if (this.matrixImages !== data.matrixImages) {
            this.matrixImages = data.matrixImages;

            this.processMatrixImages(this.matrixImages);

            if (this.timeUnit) {
              this.changeTimeUnit(this.timeUnit);
            }

            if (this.currencyUnit) {
              this.changeCurrencyUnit(this.currencyUnit);
            }
          }
        }

        if (this.query) {
          if (data.updateMatrix) {
            this.store.dispatch(new MatrixActions.UpdateMatrix(false));
            this.store.dispatch(new MatrixActions.GetMatrixImages(`${this.query}&resolution=${this.imageResolution.image}`));
          }
        }

        this.changeDetectorRef.detectChanges();
      }
    });

    this.countriesFilterStateSubscription = this.countriesFilterState.subscribe((data: any) => {
      if(data) {
        if (data.countriesFilter) {
          this.processMatrixImages(this.matrixImages);
        }
      }
    });

    this.thingsFilterStateSubscription = this.thingsFilterState.subscribe((data: any) => {
      if (data) {
        if (data.thingsFilter) {
          this.activeThing = data.thingsFilter.thing;
          this.thing = data.thingsFilter.thing.originPlural;

          if (this.embedSetId !== undefined && this.embedSetId !== 'undefined') {
            const query = `thing=${this.thing}&embed=${this.embedSetId}&resolution=${this.imageResolution.image}&lang=${this.languageService.currentLanguage}`;
            this.store.dispatch(new MatrixActions.GetPinnedPlaces(query));
          }

          this.processMatrixImages(this.matrixImages);

          this.changeDetectorRef.detectChanges();
        }
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          if (window.innerWidth === this.windowInnerWidth) {
            return;
          }

          this.windowInnerHeight = window.innerHeight;
          this.windowInnerWidth = window.innerWidth;
        });
      });

    this.queryParamsSubscribe = this.activatedRoute.queryParams.subscribe((params: any) => {
      this.thing = decodeURI(params.thing || 'Families');
      this.countries = params.countries ? decodeURI(params.countries) : 'World';
      this.regions = params.regions ? decodeURI(params.regions) : 'World';
      this.zoom = parseInt(params.zoom, 10);
      this.lowIncome = parseInt(params.lowIncome, 10);
      this.highIncome = parseInt(params.highIncome, 10);
      this.activeHouse = parseInt(params.activeHouse, 10);
      this.row = parseInt(params.row, 10) || 1;
      this.embedSetId = decodeURI(params.embed);

      this.changeDetectorRef.detectChanges();

      if (this.embedSetId !== 'undefined') {
        const query = `thing=${this.thing}&embed=${this.embedSetId}&resolution=${this.imageResolution.image}&lang=${this.languageService.currentLanguage}`;
        this.store.dispatch(new MatrixActions.GetPinnedPlaces(query));
      }

      setTimeout(() => {
        if (this.row > 1 && !this.activeHouse) {
          this.matrixImagesComponent.goToRow(this.row);
        }
      }, 1000);

      this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
        if (data) {
          if (data.streetSettings) {
            if (this.streetData !== data.streetSettings) {
              this.streetData = data.streetSettings;
              this.processStreetData();
            }
          }
        }
      });
    });

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.scrollSubscribtion = fromEvent(document, 'scroll')
      .debounceTime(50)
      .subscribe(() => {
        if (!this.itemSize) {
          this.calcItemSize();
        }

        this.processPinContainer();
        this.processScroll();
        this.setZoomButtonPosition();
        this.getPaddings();
      });

    this.store.dispatch(new StreetSettingsActions.GetStreetSettings());
    this.store.dispatch(new MatrixActions.GetCurrencyUnits());
  }

  public processStreetData(): void {
    if (this.streetData) {
      this.lowIncome = this.lowIncome ? this.lowIncome : this.streetData.poor;
      this.highIncome = this.highIncome ? this.highIncome : this.streetData.rich;

      this.lowIncome = this.lowIncome && this.lowIncome < this.streetData.poor ? this.streetData.poor : this.lowIncome;
      this.highIncome = this.highIncome && this.highIncome > this.streetData.rich ? this.streetData.rich : this.highIncome;

      if (this.lowIncome > this.highIncome) {
        this.lowIncome = this.streetData.poor;
      }

      this.thing = this.thing ? this.thing : 'Families';
      this.zoom = this.zoom ? this.zoom : 4;
      this.regions = this.regions ? this.regions : 'World';

      if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
        this.zoom = 4;
      }

      if (!this.isDesktop) {
        this.zoom = 3;
      }

      this.query = `thing=${this.thing}&countries=${this.countries}&regions=${this.regions}&zoom=${this.zoom}&row=${this.row}&lowIncome=${this.lowIncome}&highIncome=${this.highIncome}`;
      this.query += this.languageService.getLanguageParam();

      if (this.activeHouse) {
        this.query += `&activeHouse=${this.activeHouse}`;
      }

      if (this.embedSetId !== 'undefined') {
        this.query += `&embed=${this.embedSetId}`;
      }

      this.urlChanged({isBack: true, url: this.query});

      this.store.dispatch(new MatrixActions.UpdateMatrix(true));

      this.changeDetectorRef.detectChanges();
    }
  }

  public setCurrencyForLang(): void {
    let unit = null;

    switch(this.languageService.currentLanguage) {
      case 'en': {
        unit = this.currencyUnits.find(unit => unit.code === 'USD');
        break;
      }
      case 'es-ES': {
        unit = this.currencyUnits.find(unit => unit.code === 'EUR');
        break;
      }
      case 'sv-SE': {
        unit = this.currencyUnits.find(unit => unit.code === 'SEK');
        break;
      }
    }

    this.store.dispatch(new MatrixActions.SetCurrencyUnit(unit));
  }

  public changeTimeUnit(timeUnit: string): void {
    if (this.placesArr && this.currencyUnit) {
      this.placesArr = this.placesArr.map((place) => {
        if (place) {
          place.showIncome = this.calcPlaceIncome(place.income, timeUnit, this.currencyUnit.value);

          return place;
        }
      });
    }
  }

  public changeCurrencyUnit(unit: any): void {
    if (this.placesArr && this.timeUnit) {
      this.placesArr = this.placesArr.map((place) => {
        if (place) {
          place.showIncome = this.calcPlaceIncome(place.income, this.timeUnit, unit.value);

          return place;
        }
      });
    }
  }

  public calcPlaceIncome(income: number, timeUnit: string, currencyValue): number {
    let resultIncome: number = 0;

    switch(timeUnit) {
      case 'DAY': {
        resultIncome = income / 30;
        break;
      }

      case 'WEEK': {
        resultIncome = income / 4;
        break;
      }

      case 'MONTH': {
        resultIncome = income;
        break;
      }

      case 'YEAR': {
        resultIncome = income * 12;
        break;
      }
    }

    return resultIncome * currencyValue;
  }

  public openPopUp(target: string): void {
    this.socialShareService.openPopUp(target);
  }

  public clearEmbedMatrix(): void {
    if (this.placesArr) {
      this.placesArr = this.placesArr.map((place) => {
        if (place && place.pinned) {
          place.pinned = false;
        }

        return place;
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  public doneAndShare(): void {
    if (this.placesSet && this.placesSet.length > 1) {
      this.isPreviewView = true;

      this.store.dispatch(new MatrixActions.SetPinCollapsed(false));
    }
  }

  public shareEmbed(): void {
    this.isScreenshotProcessing = true;

    const query = `places=${this.placesSet.map(place => place._id).join(',')}&thingId=${this.activeThing._id}&resolution=${this.imageResolution.image}`;
    this.matrixService.savePinnedPlaces(query).then(data => {
      this.embedSetId = data.data._id;

      let queryParams = this.utilsService.parseUrl(this.query);
      queryParams.embed = this.embedSetId;

      let queryString = this.utilsService.objToQuery(queryParams);

      let updatedSet = this.placesSet.map((place) => {
        place.background = data.data.places[place._id];

        return place;
      });

      this.store.dispatch(new MatrixActions.SetPinnedPlaces(updatedSet));

      this.imageGeneratorService.generateImage().then((screenshot: any) => {
          let filesToRemove = Object.keys(data.data.places).map(k => data.data.places[k]).map(l => {
            let arr = l.split('/');

            return arr[arr.length - 1];
          });

          this.matrixService.removeTempImages(`images=${filesToRemove.join(',')}`).then((a) => {});

          const screenData = {data: screenshot, name: 'new_file.jpg'};
          this.matrixService.uploadScreenshot(screenData).then((res: any) => {
            this.isScreenshotProcessing = false;

            this.urlChangeService.replaceState('/matrix', queryString);

            this.store.dispatch(new AppActions.SetQuery(queryString));

            this.isEmbedShared = true;

            this.changeDetectorRef.detectChanges();

            let shareUrl = document.querySelector('.share-link-input') as HTMLInputElement;
            shareUrl.setAttribute('value', `http://${this.window.location.hostname}/dollar-street/matrix?${queryString}`);
            shareUrl.select();
          });
        });
    });
  }

  public backToEdit(): void {
    this.isPreviewView = false;
  }

  public setPinHeaderTitle(): void {
    if (!this.placesSet || !this.placesSet.length) {
      return;
    }

    let result = this.placesSet.map(place => place.country);

    this.pinHeaderTitle = `${result.length} families in ${result.join(', ')} are pinned to compare`;

    this.changeDetectorRef.detectChanges();
  }

  public imageIsUploaded(index: number): void {
    this.zone.run(() => {
      this.placesSet[index].isUploaded = true;
    });
  }

  public toUrl(image: any): string {
    return `url("${image}")`;
  }

  public ngOnDestroy(): void {
    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }

    if (this.scrollSubscribtion) {
      this.scrollSubscribtion.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.queryParamsSubscribe) {
      this.queryParamsSubscribe.unsubscribe();
    }

    if (this.thingsFilterStateSubscription) {
      this.thingsFilterStateSubscription.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }

  public streetChanged(event: any): void {
    this.urlChanged(event);

    this.processMatrixImages(this.matrixImages);

    // this.store.dispatch(new MatrixActions.UpdateMatrix(true));
  }

  public processPinContainer(): void {
    if (this.pinContainerElement) {
      if (!this.isEmbedView) {
        this.pinContainerElement.style.minHeight = '0px';
        this.store.dispatch(new MatrixActions.SetPinCollapsed(true));
      }
    } else {
      this.pinContainerElement = document.querySelector('.pin-container') as HTMLElement;
    }
  }

  public pinModeExpand(): void {
    this.store.dispatch(new MatrixActions.SetPinCollapsed(false));

    this.pinContainerElement = document.querySelector('.pin-container') as HTMLElement;

    if (this.pinContainerElement) {
      this.pinContainerElement.style.minHeight = 'auto';
    }
  }

  public pinModeClose(): void {
      this.store.dispatch(new MatrixActions.SetPinMode(false));

      this.isEmbedView = false;

      this.clearEmbedMatrix();
  }

  public removePlaceFromSet(e: MouseEvent, place: any): void {
    e.stopPropagation();

    if (this.placesSet && this.placesSet.length > 0) {
      let currentPlace: any = this.placesArr.find(el => el._id === place._id);

      currentPlace.pinned = false;

      this.store.dispatch(new MatrixActions.RemovePlaceFromSet(place));
    }
  }

  public processScroll(): void {
    if (!this.guideContainerElement) {
      this.guideContainerElement = document.querySelector('.quick-guide-container') as HTMLElement;
    }

    let guideOffset: number = (this.guideContainerElement ? this.guideContainerElement.offsetHeight : 0);

    let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) - guideOffset;

    let distance = scrollTop / this.itemSize;

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

      let query: string = `${this.query.replace(/row\=\d*/, `row=${this.row}`)}`;

      this.query = query;

      this.urlChangeService.replaceState('/matrix', query);
    }

    let clonePlaces = cloneDeep(this.shownPlaces);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  public getPaddings(): void {
    let matrixHeaderHeight: number = this.matrixHeaderElement.offsetHeight;

    if (this.guideContainerElement) {
      matrixHeaderHeight += this.guideContainerElement.offsetHeight;
    }

    this.getVisibleRows(matrixHeaderHeight);

    if (this.clonePlaces && this.clonePlaces.length) {
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    }
  }

  public getVisibleRows(headerHeight: number): void {
    let viewable = this.windowInnerHeight - headerHeight;

    let distance = viewable / this.itemSize;
    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.visiblePlaces = row;

    this.clonePlaces = cloneDeep(this.shownPlaces);
  }

  public hoverPlaces(place: any): void {
    this.hoverPlace.next(place);
  }

  public imageHeightChanged(size: number): void {
    if (this.row && !this.activeHouse) {
      this.itemSize = size;

      this.matrixImagesComponent.goToRow(this.row);
    }
  }

  public calcItemSize(): void {
    let imageContentElement = this.element.querySelector('.image-content') as HTMLElement;
    let imagesContainerElement = this.element.querySelector('.images-container') as HTMLElement;

    if (!imagesContainerElement || !imageContentElement) {
      return;
    }

    let widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imageContentElement).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(imagesContainerElement).getPropertyValue('padding-left');

    let imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    let imageHeight = (imagesContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - imageMargin;

    this.itemSize = imageHeight + imageMargin;
  }

  public scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  /*public processMatrixImages(data: any): void {
    if (!data || !data.zoomPlaces || !data.streetPlaces) {
      return;
    }

    let queryParams: any = this.utilsService.parseUrl(this.query);
    this.zoom = queryParams.zoom;

    let zoomPlacesData = data.zoomPlaces;
    let streetPlacesData = data.streetPlaces;

    this.filtredPlaces = zoomPlacesData.filter((place: any): boolean => {
      return place && place.income >= queryParams.lowIncome && place.income < queryParams.highIncome;
    });

    this.matrixPlaces.next(this.filtredPlaces);
    this.placesArr = data.zoomPlaces;
    this.clonePlaces = cloneDeep(this.filtredPlaces);

    if (!streetPlacesData.length) {
      this.streetPlaces.next([]);
      this.chosenPlaces.next([]);
      return;
    }

    let incomesArr = (chain(zoomPlacesData)
      .map('income')
      .sortBy()
      .value()) as number[];

    this.streetPlaces.next(zoomPlacesData);
    this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

    this.buildTitle(this.query);

    this.angulartics2GoogleAnalytics.eventTrack(`Change filters to thing=${this.thing} countries=${this.selectedCountries} regions=${this.selectedRegions} zoom=${this.zoom} incomes=${this.lowIncome} - ` + this.highIncome, {});
  }*/

  public processMatrixImages(data: any): void {
    if (!data || !data.streetPlaces) {
      return;
    }

    let queryParams: any = this.utilsService.parseUrl(this.query);
    this.zoom = queryParams.zoom;

    this.streetPlacesData = data.streetPlaces;

    if (!this.streetPlacesData.length) {
      this.streetPlaces.next([]);
      this.chosenPlaces.next([]);
      return;
    }

    let visiblePlaces = this.streetPlacesData.filter((place: any): boolean => {
      return place && place.income >= queryParams.lowIncome && place.income < queryParams.highIncome;
    });

    this.sortPlacesService.sortPlaces(visiblePlaces, this.zoom).then((sortedPlaces: any[]) => {
      this.matrixPlaces.next(sortedPlaces);
      this.streetPlaces.next(this.streetPlacesData);

      this.clonePlaces = cloneDeep(sortedPlaces);
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

      this.shownPlaces = sortedPlaces;
      this.placesArr = sortedPlaces;

      this.buildTitle(this.query);
    });

    /*this.matrixPlaces.next(this.filtredPlaces);
    this.clonePlaces = cloneDeep(this.filtredPlaces);

    this.streetPlaces.next(streetPlacesData);
    this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

    this.buildTitle(this.query);*/

    this.angulartics2GoogleAnalytics.eventTrack(`Change filters to thing=${this.thing} countries=${this.selectedCountries} regions=${this.selectedRegions} zoom=${this.zoom} incomes=${this.lowIncome} - ` + this.highIncome, {});
  }

  public urlChanged(options: any): void {
    let {url, isZoom, isBack} = options;

    if (isZoom) {
      this.calcItemSize();

      url = url.replace(/row\=\d*/, 'row=1');
    }

    // if (!isBack) {
      // this.query = this.query.replace(/&activeHouse\=\d*/, '');
      // this.activeHouse = void 0;

      // this.hoverPlace.next(undefined);
      // this.clearActiveHomeViewBox.next(true);
    // }

    this.store.dispatch(new AppActions.SetQuery(url));
    // this.store.dispatch(new MatrixActions.UpdateMatrix(true));

    this.urlChangeService.replaceState('/matrix', url);
  }

  public activeHouseOptions(options: any): void {
    let {row, activeHouseIndex} = options;

    let queryParams: any = this.utilsService.parseUrl(this.query);

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

    let url = this.utilsService.objToQuery(queryParams);

    this.urlChanged({url: url});
  }

  public changeZoom(zoom: any): void {
    let prevZoom: number = this.zoom;

    this.zoom = zoom;

    this.calcItemSize();

    this.query = this.query.replace(/zoom\=\d*/, `zoom=${zoom}`).replace(/row\=\d*/, `row=${this.row}`);

    this.urlChangeService.replaceState('/matrix', this.query);

    this.matrixImagesComponent.changeZoom(prevZoom);

    this.processMatrixImages(this.matrixImages);
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

    this.store.dispatch(new MatrixActions.OpenIncomeFilter(false));

    this.processMatrixImages(this.matrixImages);
  }

  public scrollTop(e: MouseEvent, element: HTMLElement): void {
    if (this.windowInnerWidth >= 600 || element.className.indexOf('fixed') === -1) {
      return;
    }

    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };

  public setZoomButtonPosition(): void {
    let scrollTop: number = (document.body.scrollTop || document.documentElement.scrollTop) + this.windowInnerHeight;
    let containerHeight: number = this.element.offsetHeight + 30;

    this.zoomPositionFixed = scrollTop > containerHeight;

    this.changeDetectorRef.detectChanges();
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

  public buildTitle(url: any): any {
    let query: any = this.utilsService.parseUrl(url);
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
