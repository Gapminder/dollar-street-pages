import 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  Output,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ViewChild,
  ChangeDetectorRef, ViewChildren, QueryList
} from '@angular/core';
import { Router } from '@angular/router';

import {
  MathService,
  LoaderService,
  LanguageService,
  BrowserDetectionService,
  UtilsService,
  SortPlacesService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStates, Currency, LanguageState, MatrixState, UrlParameters } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { Place } from '../../interfaces';
import { DEBOUNCE_TIME, DefaultUrlParameters, MAX_PINNED_PLACES, MOBILE_SIZE } from '../../defaultState';
import { get, forEach, findIndex, map, difference } from "lodash";
import { PagePositionService } from '../../shared/page-position/page-position.service';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { MatrixService } from '../matrix.service';

@Component({
  selector: 'matrix-images',
  templateUrl: './matrix-images.component.html',
  styleUrls: ['./matrix-images.component.css']
})
export class MatrixImagesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('imagesContainer')
  imagesContainer: ElementRef;

  @ViewChild('imageContent')
  imageContent: ElementRef;

  @ViewChildren(MatrixImagesComponent)
  viewChildren: QueryList<MatrixImagesComponent>;

  @Input()
  thing: string;
  @Input()
  places: Observable<Place[]>;

  @Output()
  itemSizeChanged: EventEmitter<any> = new EventEmitter<any>();

  zoom: number;
  showBlock: boolean;
  row: number;
  activeHouse: number;
  query: string;
  theWorldTranslate: string;
  sorryWeHaveNoTranslate: string;
  onThisIncomeYetTranslate: string;
  inTranslate: string;
  selectedCountries: any;
  selectedRegions: any;
  activeCountries: any;
  selectedThing: any;
  imageBlockLocation: any;
  indexViewBoxHouse: number;
  positionInRow: number;
  showErrorMsg: boolean = false;
  errorMsg: any;
  placesArr: any = [];
  isDesktop: boolean;
  currentPlaces: any = [];
  element: HTMLElement;
  placesSubscribe: Subscription;
  itemSize: number;
  familyData: any;
  prevPlaceId: string;
  resizeSubscribe: Subscription;
  windowInnerWidth: number = window.innerWidth;
  visibleImages: number;
  locations: any[];
  getTranslationSubscribe: Subscription;
  appState: Observable<any>;
  quickGuideElement: HTMLElement;
  isInit: boolean;
  contentLoadedSubscription: Subscription;
  isPinMode = false;
  isEmbederShared: boolean;
  matrixState: Observable<MatrixState>;
  matrixStateSubscription: Subscription;
  placesSet: Place[];
  currencyUnit: Currency;
  viewChildrenSubscription: Subscription;

  constructor(
    elementRef: ElementRef,
    private zone: NgZone,
    private router: Router,
    private math: MathService,
    private loaderService: LoaderService,
    private browserDetectionService: BrowserDetectionService,
    private languageService: LanguageService,
    private utilsService: UtilsService,
    private store: Store<AppStates>,
    private changeDetectorRef: ChangeDetectorRef,
    private sortPlacesService: SortPlacesService,
    private pagePositionService: PagePositionService,
    private urlParametersService: UrlParametersService,
    private matrixService: MatrixService) {

    this.element = elementRef.nativeElement;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  ngAfterViewInit() {
    this.isInit = true;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD', 'SORRY_WE_HAVE_NO', 'ON_THIS_INCOME_YET', 'ON_THIS_INCOME_YET', 'IN']).subscribe((trans: any) => {
      this.sorryWeHaveNoTranslate = trans.SORRY_WE_HAVE_NO;
      this.onThisIncomeYetTranslate = trans.ON_THIS_INCOME_YET;
      this.theWorldTranslate = trans.THE_WORLD;
      this.inTranslate = trans.IN;
    });

    this.placesSubscribe = this.places
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((places: Place[]) => {
      this.showErrorMsg = false;
      this.currentPlaces = places;

      this.buildTitle(this.urlParametersService.getAllParameters());

      if (this.currentPlaces && !this.currentPlaces.length) {
        this.buildErrorMsg(this.currentPlaces);
      }
        this.getVisibleRows();
      this.loaderService.setLoader(true);

      if (this.urlParametersService.activeHouseByRoute !== null) {
        const activeHouse = Number(this.urlParametersService.activeHouseByRoute);
        this.toggleImageBlock(this.currentPlaces[activeHouse], activeHouse);
        this.urlParametersService.activeHouseByRoute = null;
      }
      process.nextTick(() => {
        this.calcItemSize();
        this.getVisibleRows();
        let sliceCount: number = this.visibleImages * 2;

        if (this.row && this.row > 1) {
          sliceCount = this.row * this.zoom + this.visibleImages;
        }

        this.placesArr = this.currentPlaces.slice(0, sliceCount);
        this.changeDetectorRef.detectChanges();
        window.dispatchEvent(new Event('resize'));
      })
    });

    this.viewChildrenSubscription = this.viewChildren
      .changes
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((event: QueryList<MatrixImagesComponent>) => {
        this.calcItemSize();
      });

    this.contentLoadedSubscription = fromEvent(document, 'DOMContentLoaded').subscribe(() => {
      this.checkQuickGuide();
    });

    this.matrixStateSubscription = this.matrixState
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: MatrixState) => {

      this.isPinMode = get(data, 'pinMode', false);
      this.isEmbederShared = get(data, 'isEmbederShared', false);

      if (get(data, 'placesSet', false)
      && data.placesSet !== this.placesSet) {
        this.placesSet = data.placesSet;
        this.setPinnedPlaces();
      }

      if (get(data, 'currencyUnit', false)) {
        if (this.currencyUnit !== data.currencyUnit) {
          this.currencyUnit = data.currencyUnit;
        }
      }

      this.zoom = get(data, 'zoom', Number(DefaultUrlParameters.zoom));

      if (get(data, 'activeHouseOptions.row'), false) {
        this.row = data.activeHouseOptions.row;
      }

      if (get(data, 'place', false)) {
        if (this.activeHouse !== data.activeHouseOptions.index) {
          this.calcItemSize();
          this.activeHouse = data.activeHouseOptions.index;
          this.row = data.activeHouseOptions.row;
          this.showBlock = !!this.activeHouse;

          process.nextTick(() => {
// wait render view block, without nextTick page does't have scroll for bottom grid elements doesn't appear view block
            this.pagePositionService.goToRow(data.activeHouseOptions.row)
          });
        }
      } else {
        this.activeHouse = undefined;
        this.showBlock = false;
      }

    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.zone.run(() => {
          if (this.windowInnerWidth === window.innerWidth) {
            return;
          }

          this.windowInnerWidth = window.innerWidth;
          this.getVisibleRows();
          this.calcItemSize();
        });
      });

    this.changeDetectorRef.detectChanges();
  }

  checkQuickGuide(): void {
    setTimeout(() => this.quickGuideElement = document.querySelector('.quick-guide-container') as HTMLElement);
  }

  togglePlaceToSet(place: Place): void {
    if (this.isEmbederShared) {
      return;
    }

    if (!place.pinned) {
      if (this.placesSet && this.placesSet.length < MAX_PINNED_PLACES) {
        // place.pinned = true;
        // place.showBackground = place.background;

        this.store.dispatch(new MatrixActions.AddPlaceToSet(place));
      }
    } else {
      place.pinned = false;

      this.store.dispatch(new MatrixActions.RemovePlaceFromSet(place));
    }
  }

  setPinnedPlaces(): void {
    forEach(this.placesSet, (place) => {
      place.showBackground = place.background;

      const placeIndex = findIndex(this.placesArr, {_id: place._id});
      if (placeIndex !== -1) {
        this.placesArr[placeIndex].pinned = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.contentLoadedSubscription) {
      this.contentLoadedSubscription.unsubscribe();
    }

    if (this.getTranslationSubscribe) {
      this.getTranslationSubscribe.unsubscribe();
    }

    if (this.placesSubscribe) {
      this.placesSubscribe.unsubscribe();
    }

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }

    if (this.viewChildrenSubscription) {
      this.viewChildrenSubscription.unsubscribe();
    }
  }

  onScrollDown(): void {
    if (this.placesArr.length) {
      const sliceCount = this.placesArr.length + this.visibleImages <= this.currentPlaces.length ? this.visibleImages : (this.currentPlaces.length - this.placesArr.length);

      const places = this.currentPlaces.slice(this.placesArr.length, this.placesArr.length + sliceCount);

      this.placesArr = this.placesArr.concat(places);
    }
  }

  changeZoom(prevZoom: number): void {
    setTimeout(() => {
      this.calcItemSize();
      this.getVisibleRows();
      this.onScrollDown();
    },0);
  }

  hoverImage(place: any): void {
    if (!this.isDesktop) {
      return;
    }

    if (this.prevPlaceId && place) {
      this.matrixService.setHoverPlaces(place);

      return;
    }

    if (this.prevPlaceId && !place) {
      this.matrixService.setHoverPlaces(this.familyData)

      return;
    }

    this.matrixService.setHoverPlaces(place);

    if (this.isDesktop) {
      return;
    }
  }

  imageIsUploaded(index: number): void {
    this.zone.run(() => {
      this.placesArr[index].isUploaded = true;
    });
  }

  buildTitle(query: UrlParameters): void {
    const regions = query.regions;
    const countries = query.countries;
    this.selectedThing = query.thing.split(',');

    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = this.theWorldTranslate;

      return;
    }

    if (regions[0] === 'World' && countries[0] !== 'World') {
      if (countries.length > 2) {
        this.activeCountries = countries;
      } else {
        this.activeCountries = countries.join(' & ');
      }
      this.selectedCountries = countries;

      return;
    }

    if (regions[0] !== 'World') {

      if (regions.length > 3) {
        this.activeCountries = this.theWorldTranslate;
      } else {
        let sumCountries = 0;
        let _difference: string[] = [];
        let regionCountries: string[] = [];

        forEach(this.locations, (location: any) => {
          if (regions.indexOf(location.region) !== -1) {
            regionCountries = regionCountries.concat((map(location.countries, 'country')) as string[]);
            sumCountries = +location.countries.length;
          }
        });

        if (sumCountries !== countries.length) {
          _difference = difference(countries, regionCountries);
        }

        if (_difference.length) {

          this.activeCountries = regions.join(',') + ',' + _difference;
        } else {
          this.activeCountries = regions.join(' & ');
        }
      }

      this.selectedRegions = regions;
      this.selectedCountries = countries;

      return;
    }

    let concatLocations: string[] = regions.concat(countries);

    if (concatLocations.length < 5) {
      this.activeCountries = concatLocations.join(' & ');
    }

    this.selectedRegions = regions;
    this.selectedCountries = countries;
  }

  buildErrorMsg(places: Place[]): void {
    if (!places.length) {

      const activeCountries = this.activeCountries.toString().replace(/,/g, ', ');

      if (this.activeCountries === this.theWorldTranslate) {
        this.showErrorMsg = true;
        this.errorMsg = this.sorryWeHaveNoTranslate + ' ' +
          this.selectedThing.toString().toLowerCase() + ' ' + this.onThisIncomeYetTranslate;
        return;
      } else {
        this.showErrorMsg = true;
        this.errorMsg = this.sorryWeHaveNoTranslate + ' ' +
          this.selectedThing.toString().toLowerCase() +
          ' ' + this.inTranslate + ' ' + activeCountries + ' ' + this.onThisIncomeYetTranslate;
        return;
      }
    }
  }

  toggleImageBlock(place: Place, index: number) {
    if (!place) {
      return;
    }

    this.familyData = Object.assign({}, place);

    this.indexViewBoxHouse = index;
    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;
    const offset = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    if (this.positionInRow === 0) {
      this.positionInRow = this.zoom;
    }

    const row: number = Math.ceil((this.indexViewBoxHouse + 1) / this.zoom);
    const activeHouseIndex: number = this.indexViewBoxHouse + 1;

    if (this.activeHouse === activeHouseIndex) {
      this.store.dispatch(new MatrixActions.UpdateActiveHouse({row, index: undefined}));
      this.store.dispatch(new MatrixActions.RemovePlace(''));
      this.urlParametersService.removeActiveHouse();
    } else {

      this.store.dispatch(new MatrixActions.SetPlace(place._id));
      // this.pagePositionService
      this.urlParametersService.setActiveHouse(index);
      this.store.dispatch(new MatrixActions.UpdateActiveHouse({row, index: activeHouseIndex}));
    }
  }

  closeImageBlock() {
    this.store.dispatch(new MatrixActions.UpdateActiveHouse({row: this.row, index: null}));
    this.store.dispatch(new MatrixActions.RemovePlace(''));
  }

  toUrl(image: any): string {
    return `url("${image}")`;
  }

  calcItemSize(): void {
    if (!this.imagesContainer || !this.imageContent) {
      return;
    }

    const imageContentElement: HTMLElement = this.imageContent.nativeElement;

    this.itemSize = imageContentElement.offsetWidth;
    this.pagePositionService.itemSize = this.itemSize;
    this.itemSizeChanged.emit(this.itemSize);
    this.checkCurrentRow();
  }

  getVisibleRows(): void {
    if (!this.imagesContainer) {
      return;
    }

    const imagesContainerElement: HTMLElement = this.imagesContainer.nativeElement as HTMLElement;

    const imageHeight: number = imagesContainerElement.offsetWidth / this.zoom;

    const visibleRows: number = Math.round(window.innerHeight / imageHeight);
    this.visibleImages = this.zoom * visibleRows;
  }

  checkCurrentRow() {
    this.row = this.pagePositionService.currentRow;
  }
}
