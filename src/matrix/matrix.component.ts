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
  Output
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { cloneDeep, find, map, difference, forEach, get } from 'lodash';
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
import { DefaultUrlParameters } from '../url-parameters/defaultState';
import { UrlParametersService } from '../url-parameters/url-parameters.service';

const TITLE_MAX_VISIBLE_COUNTRIES = 3;

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

  @Output()
  public hoverPinnedPlace: EventEmitter<any> = new EventEmitter<any>();

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
  public windowHistory: any = history;
  public scrollSubscribtion: Subscription;
  public resizeSubscribe: Subscription;
  public queryParamsSubscribe: Subscription;
  public thing: string;
  public query: string;
  public regions: string;
  public countries: string;
  public element: HTMLElement;
  public imageResolution: ImageResolutionInterface;
  public matrixImagesContainer: HTMLElement;
  public guidePositionTop: number = 0;
  public guideContainerElement: HTMLElement;
  public device: BrowserDetectionService;
  public theWorldTranslate: string;
  public getTranslationSubscribe: Subscription;
  public streetSettingsState: Observable<StreetSettingsState>;
  public appState: Observable<any>;
  public matrixState: Observable<any>;
  public headerElement: HTMLElement;
  public isInit: boolean;
  public streetSettingsStateSubscription: Subscription;
  public appStateSubscription: Subscription;
  public matrixStateSubscription: Subscription;
  public isQuickGuideOpened: boolean;
  public isPinMode: boolean;
  public placesSet: Array<any>;
  public pinHeaderTitle: string;
  public isPreviewView: boolean;
  public isEmbedMode: boolean;
  public embedSetId: string;
  public isEmbedShared: boolean;
  public activeThing: any;
  public matrixImages: any;
  public isScreenshotProcessing: boolean;
  public timeUnit: TimeUnit;
  public currencyUnit: Currency;
  public currencyUnits: Currency[];
  public streetPlacesData: Place[];
  public timeUnits: TimeUnit[];
  public plusSignWidth: number;
  public pinPlusArr: number[] = new Array(6);
  public pinPlusCount: number = 6;
  public pinPlusOffset: number = 16;
  public matrixContainerElement: HTMLElement;
  public shareUrl: string;
  public sharedImageUrl: string;
  public storeSubscription: Subscription

  public constructor(element: ElementRef,
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
                     private urlParametersService: UrlParametersService) {
    this.element = element.nativeElement;

    this.isMobile = this.browserDetectionService.isMobile();
    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);
  }

  public ngAfterViewInit(): void {
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
      .debounceTime(50)
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
          this.setMatrixTopPadding(0);
        }

        if (get(matrix, 'embedMode', false)) {
          this.isEmbedMode = true;
        } else {
          this.isEmbedMode = false;
          if (!this.isPinMode) {
            this.setMatrixTopPadding(0);
          }
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

          if (get(matrix,'embedMode', false)) {
            this.store.dispatch(new MatrixActions.OpenQuickGuide(false));
          }

        } else {
          this.isQuickGuideOpened = false;
        }

        if (get(matrix, 'placesSet' , false) && this.placesSet !== matrix.placesSet) {
          this.placesSet = matrix.placesSet;

          if (this.currencyUnit) {
            this.initPlacesSet();
          }

          setTimeout(() => {
            let pinContainerElement = this.element.querySelector('.pin-container') as HTMLElement;

            if (pinContainerElement) {
              const pinContainerHeight = pinContainerElement.getClientRects()[0].height;

              this.setMatrixTopPadding(pinContainerHeight - 134);
            }
          }, 100);
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

        setTimeout(() => {
          if (this.row > 1 && !this.activeHouse) {
            this.matrixImagesComponent.goToRow(this.row);
          }
        }, 1000);

        if (get(matrix, 'embedSetId', false)
          && this.embedSetId !== matrix.embedSetId) {
          this.embedSetId = matrix.embedSetId;
          const query = `thing=${this.thing}&embed=${this.embedSetId}&resolution=${this.imageResolution.image}&lang=${this.languageService.currentLanguage}`;
          this.store.dispatch(new MatrixActions.GetPinnedPlaces(query));
          this.store.dispatch(new MatrixActions.SetEmbedMode(true));
        }

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

  public initPlacesSet(): void {
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

  public setMatrixTopPadding(value: number): void {
    const currentPaddingTop = +this.matrixContainerElement.style.paddingTop.replace('px', '');
    const diff = value - currentPaddingTop;
    this.matrixContainerElement.style.paddingTop = value.toString() + 'px';
    window.scrollTo(0, window.pageYOffset + diff);
  }

  public onPinnedPlaceHover(place: any): void {
    if (!this.isDesktop) {
      return;
    }

    if (!place) {
      this.hoverPinnedPlace.emit(undefined);

      return;
    }

    this.hoverPinnedPlace.emit(place);
  }

  public processStreetData(): void {
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
      this.zoom = this.zoom ? this.zoom : 4;
      this.regions = this.regions ? this.regions : 'World';

      if (this.isDesktop && (!this.zoom || this.zoom < 2 || this.zoom > 10)) {
        this.zoom = 4;
      }

      if (!this.isDesktop) {
        this.zoom = 3;
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  public changeTimeUnit(timeUnit: TimeUnit): void {
    if (this.placesArr && this.currencyUnit) {
      this.placesArr = this.placesArr.map((place) => {
        if (place) {
          place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, timeUnit.code, this.currencyUnit.value);

          return place;
        }
      });
    }
  }

  public changeCurrencyUnit(currencyUnit: any): void {
    if (this.placesArr && this.timeUnit) {
      this.placesArr = this.placesArr.map((place) => {
        if (place) {
          place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, this.timeUnit.code, currencyUnit.value);

          return place;
        }
      });
    }
  }

  public openPopUp(target: string): void {
    this.socialShareService.openPopUp(target, this.shareUrl);
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

      const updatedSet = this.placesSet.map((place) => {
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
            this.urlParametersService.dispachToStore({embed: this.embedSetId});

            process.nextTick(() => {
              const shareUrlElement = document.querySelector('.share-link-input') as HTMLInputElement;
              const shareParams = this.urlParametersService.getParamsStingForPage('embed');
              const link = window.location.href.split('?')[0];
              shareUrlElement.setAttribute('value', `${link}?${shareParams}`);
              shareUrlElement.select();
            });
          });
        });
    });
  }

  public downloadImage(): void {
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

  public setPinHeaderTitle(): void {
    if (!this.placesSet || !this.placesSet.length) {
      this.pinHeaderTitle = '';

      this.changeDetectorRef.detectChanges();

      return;
    }

    const pinnedCountries = this.placesSet.map(place => place.country);
    this.pinHeaderTitle = '';
    if (pinnedCountries.length > TITLE_MAX_VISIBLE_COUNTRIES) {
      this.pinHeaderTitle = `${this.thing}`;
    } else if (pinnedCountries.length > 1 && pinnedCountries.length <= TITLE_MAX_VISIBLE_COUNTRIES) {
      this.pinHeaderTitle = `${this.thing} in ${pinnedCountries.splice(0, pinnedCountries.length - 1).join(', ')} and ${pinnedCountries[pinnedCountries.length-1]}`;
    } else {
      this.pinHeaderTitle = `${this.thing} in ${pinnedCountries.join(', ')}`;
    }

    if (this.isEmbedMode || this.isPreviewView) {
      this.pinHeaderTitle = `${this.thing} by income`;
    }

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

  public pinModeClose(openQuickGuide = false): void {
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

      // this.urlChangeService.replaceState('/matrix', query);
    }

    let clonePlaces = cloneDeep(this.placesArr);

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

    this.clonePlaces = cloneDeep(this.placesArr);
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

    const widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;

    const imageMarginLeft: string = window.getComputedStyle(imageContentElement).getPropertyValue('margin-left');
    const boxPaddingLeft: string = window.getComputedStyle(imagesContainerElement).getPropertyValue('padding-left');

    const imageMargin = parseFloat(imageMarginLeft) * 2;
    const boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    const imageHeight = (imagesContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - imageMargin;

    this.itemSize = imageHeight + imageMargin;
  }

  public scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  public processMatrixImages(data: any): void {
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

    this.sortPlacesService.sortPlaces(visiblePlaces, this.zoom).then((sortedPlaces: any[]) => {
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
    });

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

    // this.store.dispatch(new AppActions.SetQuery(url));

    // this.urlChangeService.replaceState('/matrix', url);
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
  }

  public changeZoom(zoom: number): void {
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

  public getResponseFromIncomeFilter(params: any): void {
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
