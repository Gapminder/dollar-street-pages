import 'rxjs/add/operator/debounceTime';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  AppStates,
  Currency,
  Place,
  StreetSettingsState,
  TimeUnit
} from '../interfaces';
import {
  Component,
  ElementRef,
  OnDestroy,
  NgZone,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnChanges,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { chain, cloneDeep, find, map, difference, forEach, get, uniq } from 'lodash';
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
  SortPlacesService,
  IncomeCalcService,
  LocalStorageService
} from '../common';
import * as MatrixActions from './ngrx/matrix.actions';
import { MatrixImagesComponent } from './matrix-images/matrix-images.component';
import { ImageResolutionInterface } from '../interfaces';
import { MatrixService } from './matrix.service';
import { DEBOUNCE_TIME, DefaultUrlParameters } from '../defaultState';
import { UrlParametersService } from '../url-parameters/url-parameters.service';
import { PagePositionService } from "../shared/page-position/page-position.service";

const TITLE_MAX_VISIBLE_COUNTRIES = 3;

@Component({
  selector: 'matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnDestroy, AfterViewInit, OnChanges {
  @ViewChild(MatrixImagesComponent)
  matrixImagesComponent: MatrixImagesComponent;
  @ViewChild('streetAndTitleContainer')
  streetAndTitleContainer: ElementRef;
  @ViewChild('streetContainer')
  streetContainer: ElementRef;
  @ViewChild('matrixHeader')
  matrixHeader: ElementRef;

  @ViewChild('pinField')
  pinField: ElementRef;

  @Output()
  hoverPinnedPlace: EventEmitter<any> = new EventEmitter<any>();

  matrixHeaderElement: HTMLElement;
  streetContainerElement: HTMLElement;
  streetAndTitleContainerElement: HTMLElement;
  zoomPositionFixed: boolean;
  isOpenIncomeFilter = false;
  isMobile: boolean;
  isDesktop: boolean;
  window: Window = window;
  hoverPlace: Subject<any> = new Subject<any>();
  streetPlaces: Subject<any> = new Subject<any>();
  matrixPlaces: Subject<any> = new Subject<any>();
  chosenPlaces: Subject<any> = new Subject<any>();

  @Input()
  row: number;
  zoom: number;
  lowIncome: number;
  highIncome: number;
  activeHouse: number;

  @Output()
  itemSize = 0;
  visiblePlaces: number;
  rowEtalon: number = 0;
  windowInnerWidth: number = window.innerWidth;
  windowInnerHeight: number = window.innerHeight;
  locations: any;
  countriesTranslations: any[];
  streetData: DrawDividersInterface;
  selectedRegions: any;
  activeCountries: any;
  selectedCountries: any;
  placesArr: any[];
  clonePlaces: any[];
  windowHistory: any = history;
  scrollSubscribtion: Subscription;
  resizeSubscribe: Subscription;
  queryParamsSubscribe: Subscription;
  thing: string;
  query: string;
  regions: string;
  countries: string;
  element: HTMLElement;
  imageResolution: ImageResolutionInterface;
  matrixImagesContainer: HTMLElement;
  guideContainerElement: HTMLElement;
  device: BrowserDetectionService;
  theWorldTranslate: string;
  getTranslationSubscribe: Subscription;
  streetSettingsState: Observable<StreetSettingsState>;
  appState: Observable<any>;
  matrixState: Observable<any>;
  headerElement: HTMLElement;
  isInit: boolean;
  streetSettingsStateSubscription: Subscription;
  appStateSubscription: Subscription;
  matrixStateSubscription: Subscription;
  isQuickGuideOpened: boolean;
  isPinMode: boolean;
  placesSet: Array<any>;
  pinHeaderTitle: string;
  isPreviewView: boolean;
  isEmbedMode: boolean;
  embedSetId: string;
  isEmbedShared: boolean;
  activeThing: any;
  matrixImages: any;
  isScreenshotProcessing: boolean;
  timeUnit: TimeUnit;
  currencyUnit: Currency;
  currencyUnits: Currency[];
  streetPlacesData: Place[];
  timeUnits: TimeUnit[];
  plusSignWidth: number;
  pinPlusArr: number[] = new Array(6);
  pinPlusCount = 6;
  pinPlusOffset = 16;
  matrixContainerElement: HTMLElement;
  shareUrl: string;
  sharedImageUrl: string;
  storeSubscription: Subscription;
  embedLink = '';
  showClipboardNotice = false;

  constructor(element: ElementRef,
                     private zone: NgZone,
                     private router: Router,
                     private activatedRoute: ActivatedRoute,
                     private locationStrategy: LocationStrategy,
                     private loaderService: LoaderService,
                     private urlChangeService: UrlChangeService,
                     private browserDetectionService: BrowserDetectionService,
                     private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
                     private languageService: LanguageService,
                     private changeDetectorRef: ChangeDetectorRef,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private math: MathService,
                     private matrixService: MatrixService,
                     private imageGeneratorService: ImageGeneratorService,
                     private socialShareService: SocialShareService,
                     private sortPlacesService: SortPlacesService,
                     private incomeCalcService: IncomeCalcService,
                     private localStorageService: LocalStorageService,
                     private urlParametersService: UrlParametersService,
                     private pagePositionService: PagePositionService) {
    this.element = element.nativeElement;

    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);
  }

  ngAfterViewInit(): void {
    this.headerElement = document.querySelector('.header-content') as HTMLElement;
    this.matrixContainerElement = document.querySelector('.matrix-container') as HTMLElement;

    this.plusSignWidth = this.element.offsetWidth / this.pinPlusCount - this.pinPlusOffset;

    this.matrixImagesContainer = this.matrixImagesComponent.element;
    this.matrixHeaderElement = this.matrixHeader.nativeElement;
    this.streetContainerElement = this.streetContainer.nativeElement;
    this.streetAndTitleContainerElement = this.streetAndTitleContainer.nativeElement;

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD']).subscribe((trans: any) => {
      this.theWorldTranslate = trans.THE_WORLD;
    });


    this.storeSubscription = this.store
      .debounceTime(DEBOUNCE_TIME)
      .subscribe( (state: AppStates) => {
        const appState = state.app;
        const matrix = state.matrix;
        const countriesFilter = state.countriesFilter;
        const thingFilter = state.thingsFilter;
        const streetSettings = state.streetSettings;

        if (get(appState, 'query', false)
        && this.query !== appState.query) {
            this.query = appState.query;
        }

        if (get(matrix, 'pinMode', false)) {
          this.isPinMode = true;
          this.isEmbedMode = false;
        } else {
          this.isPinMode = false;
          this.isEmbedShared = false;
          this.isPreviewView = false;
        }

        if (get(matrix, 'embedMode', false)) {
          this.isEmbedMode = true;
        } else {
          this.isEmbedMode = false;
        }

        if (get(matrix, 'matrixImages', false)
          &&  this.matrixImages !== matrix.matrixImages) {
            this.matrixImages = matrix.matrixImages;
            this.streetPlacesData = matrix.matrixImages;

            this.processMatrixImages(this.matrixImages);

            if (this.timeUnit) {
              this.changeTimeUnit(this.timeUnit);
            }

            if (this.currencyUnit) {
              this.changeCurrencyUnit(this.currencyUnit);
            }
        }

        this.zoom = Number(get(matrix, 'zoom', DefaultUrlParameters.zoom));

        if (get(matrix, 'timeUnits', false) && this.timeUnits !== matrix.timeUnits) {
          this.timeUnits = matrix.timeUnits;
        }

        if (get(matrix, 'timeUnit', false) && this.timeUnit !== matrix.timeUnit) {
          this.timeUnit = matrix.timeUnit;
          this.changeTimeUnit(matrix.timeUnit);
        }

        if (get(matrix, 'currencyUnits', false) && this.currencyUnits !== matrix.currencyUnits) {
          this.currencyUnits = matrix.currencyUnits;
        }

        if (get(matrix, 'currencyUnit', false) && this.currencyUnit !== matrix.currencyUnit) {
          this.currencyUnit = matrix.currencyUnit;
          this.changeCurrencyUnit(matrix.currencyUnit);
        }

        if (get(matrix, 'incomeFilter', false)) {
          this.isOpenIncomeFilter = true;
        } else {
          this.isOpenIncomeFilter = false;
        }

        if (get(matrix, 'quickGuide', false)) {
          this.isQuickGuideOpened = true;

          if (get(matrix, 'embedMode', false)) {
            this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
          }

        } else {
          this.isQuickGuideOpened = false;
        }

        if (get(matrix, 'placesSet' , false)
          && this.placesSet !== matrix.placesSet) {
          this.placesSet = matrix.placesSet;

          if (this.currencyUnit) {
            this.initPlacesSet();
          }

        }

        if (this.query && get(matrix, 'updateMatrix', false)) {
          this.store.dispatch(new MatrixActions.UpdateMatrix(false));
          this.store.dispatch(new MatrixActions.GetMatrixImages(`${this.query}&resolution=${this.imageResolution.image}`));
        }

        if(get(countriesFilter, 'countriesFilter', false)) {
          this.processMatrixImages(this.matrixImages);
        }


        if (get(thingFilter, 'thingsFilter', false)) {
          this.activeThing = get(thingFilter.thingsFilter, 'thing', this.activeThing);
          this.thing = get(thingFilter.thingsFilter, 'thing.originPlural', this.thing);
        }

        if (get(streetSettings, 'streetSettings', false)) {
          if (this.streetData !== streetSettings.streetSettings) {
            this.streetData = streetSettings.streetSettings;
            this.processStreetData();
          }

          const poor = get(this.streetData, 'poor', DefaultUrlParameters.lowIncome);
          const rich = get(this.streetData, 'rich', DefaultUrlParameters.highIncome);
          this.lowIncome = +get(this.streetData, 'filters.lowIncome', poor);
          this.highIncome = +get(this.streetData, 'filters.highIncome', rich);

          this.processMatrixImages(this.matrixImages);

        }

        if (get(streetSettings, 'streetSettings', false)
          && get(thingFilter, 'thingsFilter', false)) {
          this.processMatrixImages(this.matrixImages);
        }

        if (get(matrix, 'embedSetId', false)
          && this.embedSetId !== matrix.embedSetId) {
          this.embedSetId = matrix.embedSetId;
          const query = `thing=${this.thing}&embed=${this.embedSetId}&resolution=${this.imageResolution.image}&lang=${this.languageService.currentLanguage}`;
          this.store.dispatch(new MatrixActions.GetPinnedPlaces(query));
          this.store.dispatch(new MatrixActions.SetEmbedMode(true));
        }
        this.setPinModeContainerSize();
        this.changeDetectorRef.detectChanges();

      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .subscribe(() => {
        this.zone.run(() => {
          if (window.innerWidth === this.windowInnerWidth) {
            return;
          }

          this.windowInnerHeight = window.innerHeight;
          this.windowInnerWidth = window.innerWidth;

          this.plusSignWidth = this.element.offsetWidth / this.pinPlusCount - this.pinPlusOffset;
        });
      });


    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    this.scrollSubscribtion = fromEvent(document, 'scroll')
      .subscribe(() => {
        if (!this.itemSize) {
          this.calcItemSize();
        }

        this.processScroll();
        this.setZoomButtonPosition();
        this.getPaddings();
      });

  }

  ngOnChanges(): void {
    this.calcItemSize();
  }

  initPlacesSet(): void {
    this.placesSet = this.placesSet.map((place: Place) => {
      if (place) {
        place.showIncome = this.incomeCalcService
          .calcPlaceIncome(place.income, this.timeUnit.code, this.currencyUnit.value);

        return place;
      }
    });

    if (this.pinPlusCount - this.placesSet.length > 0) {
      this.pinPlusArr = new Array(this.pinPlusCount - this.placesSet.length);
    }

    if (!this.isPinMode && this.placesSet.length) {
      this.isEmbedMode = true;
    }

    this.setPinHeaderTitle();
  }

  onPinnedPlaceHover(place: Place): void {
    if (!this.isDesktop) {
      return;
    }

    if (!place) {
      this.hoverPinnedPlace.emit(undefined);

      return;
    }

    this.hoverPinnedPlace.emit(place);
  }

  processStreetData(): void {
    if (this.streetData && !this.isInit) {
      this.isInit = true;

      this.lowIncome = this.lowIncome ? this.lowIncome : this.streetData.poor;
      this.highIncome = this.highIncome ? this.highIncome : this.streetData.rich;

      this.lowIncome = this.lowIncome && this.lowIncome < this.streetData.poor ? this.streetData.poor : this.lowIncome;
      this.highIncome = this.highIncome && this.highIncome > this.streetData.rich ? this.streetData.rich : this.highIncome;

      if (this.lowIncome > this.highIncome) {
        this.lowIncome = this.streetData.poor;
      }

      this.thing = this.thing ? this.thing : 'Families';
      this.zoom = this.zoom ? this.zoom : Number(DefaultUrlParameters.zoom);
      this.regions = this.regions ? this.regions : 'World';

      if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
        this.zoom = Number(DefaultUrlParameters.zoom);
      }

      if (!this.isDesktop) {
        this.zoom = 3;
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  changeTimeUnit(timeUnit: TimeUnit): void {
    if (this.placesArr && this.currencyUnit) {
      this.placesArr = this.placesArr.map((place: Place) => {
        if (place) {
          place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, timeUnit.code, this.currencyUnit.value);

          return place;
        }
      });
    }
  }

  changeCurrencyUnit(currencyUnit: any): void {
    if (this.placesArr && this.timeUnit) {
      this.placesArr = this.placesArr.map((place: Place) => {
        if (place) {
          place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, this.timeUnit.code, currencyUnit.value);

          return place;
        }
      });
    }
  }

  openPopUp(target: string): void {
    this.socialShareService.openPopUp(target, this.shareUrl);
  }

  clearEmbedMatrix(): void {
    if (this.placesArr) {
      this.placesArr = this.placesArr.map((place: Place) => {
        if (place && place.pinned) {
          place.pinned = false;
        }

        return place;
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  doneAndShare(): void {
    if (this.placesSet && this.placesSet.length > 1) {
      this.isPreviewView = true;
      this.shareEmbed();
    }
  }

  public shareEmbed(): void {
    this.isScreenshotProcessing = true;
    this.store.dispatch(new MatrixActions.SetIsEmbededShared(true));
    const query = `places=${this.placesSet.map(place => place._id).join(',')}&thingId=${this.activeThing._id}&resolution=${this.imageResolution.image}`;
    this.matrixService.savePinnedPlaces(query).then(data => {
      const embedId = data.data._id;
      const placesList = data.data.places;
      const shareUrl = data.data.url;
      this.embedSetId = embedId;

      const queryParams = this.utilsService.parseUrl(this.query);
      queryParams.embed = this.embedSetId;

      const updatedSet = this.placesSet.map((place: Place) => {
        place.showBackground = placesList[place._id];

        return place;
      });

      this.store.dispatch(new MatrixActions.SetPinnedPlaces(updatedSet));

      this.imageGeneratorService.generateImage().then((screenshot: any) => {
          let filesToRemove = Object.keys(placesList).map(k => placesList[k]).map(l => {
            let arr = l.split('/');
            return arr[arr.length - 1];
          });

          this.matrixService.removeTempImages(`images=${filesToRemove.join(',')}`).then((a) => {});

          const screenData = {imageData: screenshot, imageName: Date.now()+'.jpg', embedId: this.embedSetId};
          this.matrixService.uploadScreenshot(screenData).then((res: any) => {
            this.sharedImageUrl = res.data.imageUrl;

            this.isScreenshotProcessing = false;

            this.isEmbedShared = true;

            this.changeDetectorRef.detectChanges();

            this.shareUrl = shareUrl;
            this.urlParametersService.dispatchToStore({embed: this.embedSetId});

            const link = window.location.href.split('?')[0];
            const shareParams = this.urlParametersService.getParamsStingForPage('embed');

            this.embedLink = `${link}?${shareParams}`;

            this.pinField.nativeElement.value = this.embedLink;
            this.pinField.nativeElement.select();
          });
        });
    });
  }

  downloadImage(): void {
    const url = this.sharedImageUrl;
    const countries = this.placesSet.map(place => place.country);
    const filename = `DollarStreet_${this.thing}_in_${countries}`;
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  setPinHeaderTitle(): void {
    if (!this.placesSet || !this.placesSet.length) {
      this.pinHeaderTitle = '';

      this.changeDetectorRef.detectChanges();

      return;
    }

    const pinnedCountries = this.placesSet.map(place => place.country);
    const countriesList = uniq(pinnedCountries);

    this.pinHeaderTitle = '';

    if (countriesList.length > TITLE_MAX_VISIBLE_COUNTRIES) {
      this.pinHeaderTitle = `${this.thing}`;
    } else if (countriesList.length > 1 && countriesList.length <= TITLE_MAX_VISIBLE_COUNTRIES) {
      this.pinHeaderTitle = `${this.thing} in ${countriesList.splice(0, countriesList.length - 1).join(', ')} and ${countriesList[countriesList.length-1]}`;
    } else {
      this.pinHeaderTitle = `${this.thing} in ${countriesList.join(', ')}`;
    }

    if (this.isEmbedMode || this.isPreviewView) {
      this.pinHeaderTitle = `${this.thing} by income`;
    }

    this.changeDetectorRef.detectChanges();
  }

  imageIsUploaded(index: number): void {
    this.zone.run(() => {
      this.placesSet[index].isUploaded = true;
    });
  }

  toUrl(image: any): string {
    return `url("${image}")`;
  }

  ngOnDestroy(): void {
    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }

    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }

    if (this.scrollSubscribtion) {
      this.scrollSubscribtion.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }
    this.loaderService.setLoader(false);
  }

  pinModeClose(openQuickGuide = false): void {
      this.store.dispatch(new MatrixActions.SetPinMode(false));
      this.store.dispatch(new MatrixActions.SetEmbedMode(false));
      this.store.dispatch(new MatrixActions.SetIsEmbededShared(false));
      this.store.dispatch(new MatrixActions.RemoveEmbededId(''));

      this.embedSetId = undefined;
      this.clearEmbedMatrix();

      if (openQuickGuide) {
        this.localStorageService.removeItem('quick-guide');
        window.scrollTo(0, 0)
        this.store.dispatch(new MatrixActions.OpenQuickGuide(true));
      }
  }

  removePlaceFromSet(e: MouseEvent, place: Place): void {
    e.stopPropagation();

    if (this.placesSet && this.placesSet.length > 0) {
      let currentPlace: any = this.placesArr.find(el => el._id === place._id);

      currentPlace.pinned = false;

      this.store.dispatch(new MatrixActions.RemovePlaceFromSet(place));
    }
  }

  processScroll(): void {
    this.row = this.pagePositionService.row;

    let clonePlaces = cloneDeep(this.placesArr);

    if (clonePlaces && clonePlaces.length && this.visiblePlaces) {
      this.chosenPlaces.next(clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * this.visiblePlaces));
    }
  }

  getPaddings(): void {
    let matrixHeaderHeight: number = this.matrixHeaderElement.offsetHeight;

    if (this.guideContainerElement) {
      matrixHeaderHeight += this.guideContainerElement.offsetHeight;
    }

    this.getVisibleRows(matrixHeaderHeight);

    if (this.clonePlaces && this.clonePlaces.length) {
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));
    }
  }

  getVisibleRows(headerHeight: number): void {
    let viewable = this.windowInnerHeight - headerHeight;

    let distance = viewable / this.itemSize;
    let rest = distance % 1;
    let row = distance - rest;

    if (rest >= 0.85) {
      row++;
    }

    this.visiblePlaces = row;

    this.clonePlaces = cloneDeep(this.placesArr);
  }

  hoverPlaces(place: any): void {
    this.hoverPlace.next(place);
  }

  imageHeightChanged(size: number): void {
    if (this.row && !this.activeHouse) {
      this.itemSize = size;

      this.pagePositionService.goToRow(this.row);
    }
  }

  calcItemSize(): void {
    const imageContentElement = this.element.querySelector('.image-content') as HTMLElement;
    const imagesContainerElement = this.element.querySelector('.images-container') as HTMLElement;

    if (!imagesContainerElement || !imageContentElement) {
      return;
    }

    const widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;


    const boxPaddingLeft: string = window.getComputedStyle(imagesContainerElement).getPropertyValue('padding-left');


    const boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    const imageHeight = (imagesContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom;

    this.itemSize = imageHeight;
  }

  processMatrixImages(data: any): void {
    if (!data || !data.streetPlaces) {
      return;
    }

    this.streetPlacesData = data.streetPlaces;

    if (!this.streetPlacesData.length) {
      this.streetPlaces.next([]);
      this.chosenPlaces.next([]);
      return;
    }

    let visiblePlaces = this.streetPlacesData.filter((place: Place): boolean => {
      return place && place.income >= this.lowIncome && place.income < this.highIncome;
    });

    this.sortPlacesService.sortPlaces(visiblePlaces, this.zoom).then((sortedPlaces: Place[]) => {
      this.matrixPlaces.next(sortedPlaces);
      this.streetPlaces.next(this.streetPlacesData);

      this.clonePlaces = cloneDeep(sortedPlaces);
      this.chosenPlaces.next(this.clonePlaces.splice((this.row - 1) * this.zoom, this.zoom * (this.visiblePlaces || 1)));

      this.placesArr = sortedPlaces;

      if (this.currencyUnit) {
        this.changeCurrencyUnit(this.currencyUnit);
      }
      this.changeTimeUnit(this.timeUnit);

      this.buildTitle(this.query);

      window.dispatchEvent(new Event('resize'));
      this.calcItemSize();
    });

    this.hoverPlaces(undefined);

    this.angulartics2GoogleAnalytics.eventTrack(`Change filters to thing=${this.thing} countries=${this.selectedCountries} regions=${this.selectedRegions} zoom=${this.zoom} incomes=${this.lowIncome} - ` + this.highIncome, {});
  }

  urlChanged(options: any): void {
    let {url, isZoom, isBack} = options;

    if (isZoom) {
      this.calcItemSize();

      url = url.replace(/row\=\d*/, 'row=1');
    }
  }

  activeHouseOptions(options: any): void {
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
  }

  changeZoom(zoom: number): void {
    if (zoom <= 1) {
      return;
    }

    if (!this.isDesktop ? zoom >= 4 : zoom >= 10) {
      return;
    }
    const prevZoom: number = this.zoom;
    this.store.dispatch(new MatrixActions.ChangeZoom(zoom));

    this.calcItemSize();

    this.matrixImagesComponent.changeZoom(prevZoom);

    this.processMatrixImages(this.matrixImages);

    this.changeDetectorRef.detectChanges();
  }

  getResponseFromIncomeFilter(params: any): void {
    if (params.lowIncome && params.highIncome) {
      this.query = this.query
        .replace(/lowIncome\=\d*/, `lowIncome=${params.lowIncome}`)
        .replace(/highIncome\=\d*/, `highIncome=${params.highIncome}`);

      this.lowIncome = params.lowIncome;
      this.highIncome = params.highIncome;
    }

    this.store.dispatch(new MatrixActions.OpenIncomeFilter(false));

    this.processMatrixImages(this.matrixImages);
  }

  scrollTop(e: MouseEvent, element: HTMLElement): void {
    if (this.windowInnerWidth >= 600 || element.className.indexOf('fixed') === -1) {
      return;
    }

    e.preventDefault();

    this.utilsService.animateScroll('scrollBackToTop', 20, 1000, this.isDesktop);
  };

  setZoomButtonPosition(): void {
    let scrollTop: number = (document.body.scrollTop || document.documentElement.scrollTop) + this.windowInnerHeight;
    let containerHeight: number = this.element.offsetHeight + 30;

    this.zoomPositionFixed = scrollTop > containerHeight;

    this.changeDetectorRef.detectChanges();
  }

  findCountryTranslatedName(countries: any[]): any {
    return map(countries, (item: string): any => {
      const findTransName: any = find(this.countriesTranslations, {originName: item});
      return findTransName ? findTransName.country : item;
    });
  }

  findRegionTranslatedName(regions: any[]): any {
    return map(regions, (item: string): any => {
      const findTransName: any = find(this.locations, {originRegionName: item});
      return findTransName ? findTransName.region : item;
    });
  }

  buildTitle(url: any): any {
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

  setPinModeContainerSize():void {
    const container = document.querySelector('.pin-wrap') as HTMLElement;
    const pinContainer = container.querySelector('.pin-container') as HTMLElement;
    const height = pinContainer ? pinContainer.offsetHeight : 0;
    container.style.height = `${height.toString()}px`;
  }

  clipboardSuccess(): void {
    this.showClipboardNotice = true;
    setTimeout( () => {
      this.showClipboardNotice = false;
    }, 2000)
  }

}
