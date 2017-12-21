import 'rxjs/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  Output,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MatrixViewBlockComponent } from '../matrix-view-block/matrix-view-block.component';
import {
  MathService,
  LoaderService,
  LanguageService,
  BrowserDetectionService,
  UtilsService,
  SortPlacesService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import {Place} from "../../interfaces";

@Component({
  selector: 'matrix-images',
  templateUrl: './matrix-images.component.html',
  styleUrls: ['./matrix-images.component.css']
})
export class MatrixImagesComponent implements OnInit, OnDestroy {
  @ViewChild(MatrixViewBlockComponent)
  public matrixViewBlockComponent: MatrixViewBlockComponent;
  @ViewChild('imagesContainer')
  public imagesContainer: ElementRef;
  @ViewChild('imageContent')
  public imageContent: ElementRef;

  @Input()
  public thing: string;
  @Input()
  public places: Observable<any>;
  @Input()
  public activeHouse: number;
  @Input()
  public zoom: number;
  @Input()
  public showBlock: boolean;
  @Input()
  public row: number;
  @Input()
  public clearActiveHomeViewBox: Subject<any>;

  @Output()
  public hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public filter: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public itemSizeChanged: EventEmitter<any> = new EventEmitter<any>();

  public query: string;
  public theWorldTranslate: string;
  public sorryWeHaveNoTranslate: string;
  public onThisIncomeYetTranslate: string;
  public inTranslate: string;
  public selectedCountries: any;
  public selectedRegions: any;
  public activeCountries: any;
  public selectedThing: any;
  public imageBlockLocation: any;
  public indexViewBoxHouse: number;
  public positionInRow: number;
  public showErrorMsg: boolean = false;
  public errorMsg: any;
  public placesArr: any = [];
  public viewBlockHeight: number;
  public isDesktop: boolean;
  public currentPlaces: any = [];
  public element: HTMLElement;
  public placesSubscribe: Subscription;
  public itemSize: number;
  public imageHeight: number;
  public familyData: any;
  public prevPlaceId: string;
  public resizeSubscribe: Subscription;
  public clearActiveHomeViewBoxSubscribe: Subscription;
  public imageMargin: number;
  public windowInnerWidth: number = window.innerWidth;
  public visibleImages: number;
  public locations: any[];
  public getTranslationSubscribe: Subscription;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;
  public quickGuideElement: HTMLElement;
  public isInit: boolean;
  public contentLoadedSubscription: Subscription;
  public isPinMode: boolean;
  public isEmbederShared: boolean;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public placesSet: Array<any>;
  public maxPinnedCount: number = 6;
  public currencyUnit: any;

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private router: Router,
                     private math: MathService,
                     private loaderService: LoaderService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private changeDetectorRef: ChangeDetectorRef,
                     private sortPlacesService: SortPlacesService) {
    this.element = elementRef.nativeElement;

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngOnInit(): any {
    this.isInit = true;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD', 'SORRY_WE_HAVE_NO', 'ON_THIS_INCOME_YET', 'ON_THIS_INCOME_YET', 'IN']).subscribe((trans: any) => {
      this.sorryWeHaveNoTranslate = trans.SORRY_WE_HAVE_NO;
      this.onThisIncomeYetTranslate = trans.ON_THIS_INCOME_YET;
      this.theWorldTranslate = trans.THE_WORLD;
      this.inTranslate = trans.IN;
    });

    this.placesSubscribe = this.places.subscribe((places: any) => {
      this.showErrorMsg = false;
      this.showBlock = false;
      this.currentPlaces = places;

      if (this.currentPlaces && this.query && !this.currentPlaces.length) {
        this.buildErrorMsg(this.currentPlaces);
      }

      setTimeout(() => {
        this.getVisibleRows();


        let sliceCount: number = this.visibleImages * 2;

        if (this.row && this.row > 1) {
          sliceCount = this.row * this.zoom + this.visibleImages;
        }

        //let sliceCount: number = this.placesArr.length + this.visibleImages <= this.currentPlaces.length ? this.placesArr.length + this.visibleImages : (this.currentPlaces.length - this.placesArr.length);

        // this.placesArr = _.slice(this.currentPlaces, 0, sliceCount);
        this.placesArr = this.currentPlaces.slice(0, sliceCount);
      });

      if (this.activeHouse && this.isInit && this.currentPlaces) {
        setTimeout(() => {
          this.goToImageBlock(this.currentPlaces[this.activeHouse - 1], this.activeHouse - 1, true);
          this.isInit = false;
        });
      }

      setTimeout(() => {
        this.calcItemSize();
        this.loaderService.setLoader(true);
      });
    });

    this.contentLoadedSubscription = fromEvent(document, 'DOMContentLoaded').subscribe(() => {
      this.checkQuickGuide();
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (this.query !== data.query) {
          this.query = data.query;
        }
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.pinMode) {
          this.isPinMode = true;
        } else {
          this.isPinMode = false;
        }

        this.isEmbederShared = data.isEmbederShared;

        if (data.placesSet) {
          this.placesSet = data.placesSet;
        }

        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
          }
        }

        this.changeDetectorRef.detectChanges();
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
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

    this.clearActiveHomeViewBoxSubscribe = this.clearActiveHomeViewBox &&
      this.clearActiveHomeViewBox.subscribe((isClean: any): void => {
        if (this.prevPlaceId && isClean) {
          this.prevPlaceId = void 0;
          this.familyData = void 0;
          this.imageBlockLocation = void 0;
          this.indexViewBoxHouse = void 0;
          this.showBlock = void 0;
          this.showErrorMsg = void 0;
        }
      });
  }

  public checkQuickGuide(): void {
    setTimeout(() => this.quickGuideElement = document.querySelector('.quick-guide-container') as HTMLElement);
  }

  public togglePlaceToSet(place: Place): void {
    if (!place.pinned) {
      if (this.placesSet && this.placesSet.length < this.maxPinnedCount) {
        place.pinned = true;
        place.showBackground = place.background;

        this.store.dispatch(new MatrixActions.AddPlaceToSet(place));
      }
    } else {
      place.pinned = false;

      this.store.dispatch(new MatrixActions.RemovePlaceFromSet(place));
    }
  }

  public ngOnDestroy(): void {
    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
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
  }

  public onScrollDown(): void {
    if (this.placesArr.length) {
      let sliceCount: number = this.placesArr.length + this.visibleImages <= this.currentPlaces.length ? this.visibleImages : (this.currentPlaces.length - this.placesArr.length);

      let places: any = this.currentPlaces.slice(this.placesArr.length, this.placesArr.length + sliceCount);

      this.placesArr = this.placesArr.concat(places);
    }
  }

  public changeZoom(prevZoom: number): void {
    setTimeout(() => {
      this.calcItemSize();
      this.getVisibleRows();
      this.onScrollDown();
    },0);
  }

  public hoverImage(place: any): void {
    if (!this.isDesktop) {
      return;
    }

    if (this.prevPlaceId && place) {
      this.hoverPlace.emit(undefined);
      this.hoverPlace.emit(place);

      return;
    }

    if (this.prevPlaceId && !place) {
      this.hoverPlace.emit(undefined);
      this.hoverPlace.emit(this.familyData);

      return;
    }

    this.hoverPlace.emit(place);

    if (this.isDesktop) {
      return;
    }
  }

  public imageIsUploaded(index: number): void {
    this.zone.run(() => {
      this.placesArr[index].isUploaded = true;
    });
  }

  public buildTitle(query: any): void {
    let regions = query.regions;
    let countries = query.countries;

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

          this.activeCountries = regions + ',' + difference;
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

  public buildErrorMsg(places: any): void {
    if (!places.length) {
      this.buildTitle(this.utilsService.parseUrl(this.query));

      let activeCountries = this.activeCountries.toString().replace(/,/g, ', ');

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

  public goToImageBlock(place: Place, index: number, isInit?: boolean): void {
    if (!place) {
      return;
    }

    this.familyData = Object.assign({}, place);

    this.indexViewBoxHouse = index;

    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;

    let offset: number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    if (this.positionInRow === 0) {
      this.positionInRow = this.zoom;
    }

    setTimeout(() => {
      this.viewBlockHeight = this.matrixViewBlockComponent ? this.matrixViewBlockComponent.element.offsetHeight : 0;
    }, 0);

    let row: number = Math.ceil((this.indexViewBoxHouse + 1) / this.zoom);
    let activeHouseIndex: number = this.indexViewBoxHouse + 1;

    if (!this.prevPlaceId) {
      this.prevPlaceId = place._id;

      this.showBlock = !this.showBlock;

      if (isInit) {
        this.changeUrl({activeHouseIndex});
        this.goToRow(row);
      } else {
        this.changeUrl({row, activeHouseIndex});
      }

      return;
    }

    if (this.prevPlaceId === place._id) {
      this.showBlock = !this.showBlock;

      if (!this.showBlock) {
        this.prevPlaceId = '';
      }

      this.changeUrl({row: row});
    } else {
      this.prevPlaceId = place._id;
      this.showBlock = true;

      this.changeUrl({row: row, activeHouseIndex: activeHouseIndex});
    }
  }

  public toUrl(image: any): string {
    return `url("${image}")`;
  }

  public goToMatrixWithCountry(params: any): void {
    this.filter.emit(params);
  }

  public changeUrl(options: {row?: number, activeHouseIndex?: number}): void {
    let {row, activeHouseIndex} = options;

    this.hoverPlace.emit(undefined);
    this.hoverPlace.emit(this.familyData);

    if (row) {
      this.goToRow(row);
      this.activeHouseOptions.emit({row: row, activeHouseIndex: activeHouseIndex});
    } else {
      this.activeHouseOptions.emit({activeHouseIndex: activeHouseIndex});
    }
  }

  public goToRow(row: number): void {
    let showPartPrevImage: number = 60;

    if (this.windowInnerWidth < 600) {
      showPartPrevImage = -20;
    }

    let scrollTop: number = row * this.itemSize - showPartPrevImage;

    if (this.quickGuideElement) {
       scrollTop += this.quickGuideElement.offsetHeight;
    }

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }, 0);
  }

  public calcItemSize(): void {
    if (!this.imagesContainer || !this.imageContent) {
      return;
    }

    let imageContentElement: HTMLElement = this.imageContent.nativeElement;

    this.itemSize = imageContentElement.offsetWidth;

    this.itemSizeChanged.emit(this.itemSize);
  }

  public getVisibleRows(): void {
    if (!this.imagesContainer) {
      return;
    }

    let imagesContainerElement: HTMLElement = this.imagesContainer.nativeElement as HTMLElement;

    let imageHeight: number = imagesContainerElement.offsetWidth / this.zoom;

    let visibleRows: number = Math.round(window.innerHeight / imageHeight);

    this.visibleImages = this.zoom * visibleRows;
  }
}
