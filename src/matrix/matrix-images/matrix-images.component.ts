import 'rxjs/operator/debounceTime';

import { Component, Input, EventEmitter, ElementRef, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { TranslateService } from 'ng2-translate';

import * as _ from 'lodash';

import { MathService, LoaderService, CountriesFilterService, BrowserDetectionService } from '../../common';

@Component({
  selector: 'matrix-images',
  templateUrl: './matrix-images.component.html',
  styleUrls: ['./matrix-images.component.css']
})

export class MatrixImagesComponent implements OnInit, OnDestroy {
  @Input('query')
  public query: string;
  @Input('thing')
  public thing: string;
  @Input('places')
  public places: Observable<any>;
  @Input('activeHouse')
  public activeHouse: number;
  @Input('zoom')
  public zoom: number;
  @Input('showblock')
  public showblock: boolean = false;
  @Input('row')
  public row: number;
  @Input('guidePositionTop')
  public guidePositionTop: number;
  @Input('clearActiveHomeViewBox')
  public clearActiveHomeViewBox: Subject<any>;

  @Output('hoverPlace')
  public hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output('activeHouseOptions')
  public activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output('filter')
  public filter: EventEmitter<any> = new EventEmitter<any>();

  public translate: TranslateService;
  public sorryWeHaveNoTranslate: string;
  public onThisIncomeYetTranslate: string;
  public inTranslate: string;
  public translateOnLangChangeSubscribe: Subscription;
  public translateGetSorryWeHaveNoSubscribe: Subscription;
  public translateGetOnThisIncomeYetSubscribe: Subscription;
  public translateGetInSubscribe: Subscription;

  public selectedCountries: any;
  public selectedRegions: any;
  public activeCountries: any;
  public selectedThing: any;
  public imageBlockLocation: any;
  public indexViewBoxHouse: number;
  public positionInRow: number;
  public math: MathService;
  public showErrorMsg: boolean = false;
  public errorMsg: any;
  public placesArr: any = [];
  public viewBlockHeight: number;
  public isDesktop: boolean;
  public router: Router;
  public currentPlaces: any = [];
  public element: HTMLElement;
  public placesSubscribe: Subscription;
  public itemSize: number;
  public imageHeight: number;
  public countriesFilterService: CountriesFilterService;
  public countriesFilterServiceSubscribe: Subscription;
  public familyData: any;
  public prevPlaceId: string;
  public resizeSubscribe: Subscription;
  public zone: NgZone;
  public clearActiveHomeViewBoxSubscribe: Subscription;
  public imageMargin: number;
  public windowInnerWidth: number = window.innerWidth;
  public visibleImages: number;
  public loaderService: LoaderService;
  public locations: any[];
  public device: BrowserDetectionService;

  public getLanguage: string = 'fr';

  public constructor(zone: NgZone,
                     router: Router,
                     element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     countriesFilterService: CountriesFilterService,
                     browserDetectionService: BrowserDetectionService,
                     translate: TranslateService) {
    this.translate = translate;
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.loaderService = loaderService;
    this.device = browserDetectionService;
    this.countriesFilterService = countriesFilterService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): any {
    let isInit: boolean = true;
    this.isDesktop = this.device.isDesktop();

    this.translateGetSorryWeHaveNoSubscribe = this.translate.get('SORRY_WE_HAVE_NO').subscribe((res: any) => {
      this.sorryWeHaveNoTranslate = res;
    });

    this.translateGetOnThisIncomeYetSubscribe = this.translate.get('ON_THIS_INCOME_YET').subscribe((res: any) => {
      this.onThisIncomeYetTranslate = res;
    });

    this.translateGetInSubscribe = this.translate.get('IN').subscribe((res: any) => {
      this.inTranslate = res;
    });

    this.translateOnLangChangeSubscribe = this.translate.onLangChange.subscribe((event: any) => {
      const noDataTranslation = event.translations;
      this.sorryWeHaveNoTranslate = noDataTranslation.SORRY_WE_HAVE_NO;
      this.onThisIncomeYetTranslate = noDataTranslation.ON_THIS_INCOME_YET;
      this.inTranslate = noDataTranslation.IN;
      if (this.currentPlaces && this.query && !this.currentPlaces.length) {
        this.buildErrorMsg(this.currentPlaces);
      }
    });

    this.placesSubscribe = this.places.subscribe((places: any) => {
      this.showErrorMsg = false;
      this.showblock = false;
      this.currentPlaces = places;
      this.buildErrorMsg(this.currentPlaces);
      setTimeout(() => {
        this.getVisibleRows();
        let numberSplice: number = this.visibleImages * 2;

        if (this.row && this.row > 1) {
          numberSplice = this.row * this.zoom + this.visibleImages;
        }

        this.placesArr = _.slice(this.currentPlaces, 0, numberSplice);
      }, 0);

      setTimeout(() => {
        this.getImageHeight();
        this.loaderService.setLoader(true);
      }, 0);

      if (this.activeHouse && isInit) {
        setTimeout(() => {
          this.goToImageBlock(this.currentPlaces[this.activeHouse - 1], this.activeHouse - 1, true);
          isInit = false;
        }, 0);
      }
    });

    this.countriesFilterServiceSubscribe = this.countriesFilterService
      .getCountries(`thing=${this.thing}&lang=${this.getLanguage}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.locations = res.data;
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
          this.getImageHeight();
        });
      });

    this.clearActiveHomeViewBoxSubscribe = this.clearActiveHomeViewBox &&
      this.clearActiveHomeViewBox.subscribe((isClean: any): void => {
        if (this.prevPlaceId && isClean) {
          this.prevPlaceId = void 0;
          this.familyData = void 0;
          this.imageBlockLocation = void 0;
          this.indexViewBoxHouse = void 0;
          this.showblock = void 0;
          this.showErrorMsg = void 0;
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.translateOnLangChangeSubscribe.unsubscribe) {
      this.translateOnLangChangeSubscribe.unsubscribe();
    }

    if (this.translateGetSorryWeHaveNoSubscribe.unsubscribe) {
      this.translateGetSorryWeHaveNoSubscribe.unsubscribe();
    }

    if (this.translateGetOnThisIncomeYetSubscribe.unsubscribe) {
      this.translateGetOnThisIncomeYetSubscribe.unsubscribe();
    }

    if (    this.translateGetInSubscribe.unsubscribe) {
      this.translateGetInSubscribe.unsubscribe();
    }

    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }

    this.placesSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();
  }

  public onScrollDown(): void {
    if (this.placesArr.length && this.placesArr.length !== this.currentPlaces.length) {
      let places: any = _.slice(this.currentPlaces, this.placesArr.length, this.placesArr.length + this.visibleImages);
      this.placesArr = _.concat(this.placesArr, places);
    }
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

  public buildErrorMsg(places: any): void {
    if (!places.length) {
      let activeCountries = this.activeCountries.toString().replace(/,/g, ', ');

      if (this.activeCountries === 'the world') {
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

  public goToImageBlock(place: any, index: number, isInit?: boolean): void {
    this.indexViewBoxHouse = index;
    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;
    let offset: number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = JSON.parse(JSON.stringify(place));

    setTimeout(() => {
      let viewBlockBox = this.element.querySelector('matrix-view-block') as HTMLElement;

      this.viewBlockHeight = viewBlockBox ? viewBlockBox.offsetHeight : 0;
    }, 0);

    let row: number = Math.ceil((this.indexViewBoxHouse + 1) / this.zoom);
    let activeHouseIndex: number = this.indexViewBoxHouse + 1;

    if (!this.prevPlaceId) {
      this.prevPlaceId = place._id;
      this.showblock = !this.showblock;

      if (isInit) {
        this.changeUrl({activeHouseIndex: activeHouseIndex});
        this.goToRow(row);
      } else {
        this.changeUrl({row: row, activeHouseIndex: activeHouseIndex});
      }

      return;
    }

    if (this.prevPlaceId === place._id) {
      this.showblock = !this.showblock;

      if (!this.showblock) {
        this.prevPlaceId = '';
      }

      this.changeUrl({row: row});
    } else {
      this.prevPlaceId = place._id;
      this.showblock = true;

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

    if (this.guidePositionTop || this.guidePositionTop === 0) {
      scrollTop += this.guidePositionTop;
    }

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }, 0);
  }

  public getImageHeight(): void {
    let boxContainer = this.element.querySelector('.images-container') as HTMLElement;

    if (!boxContainer) {
      return;
    }

    let imgContent = this.element.querySelector('.image-content') as HTMLElement;

    let widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imgContent).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(boxContainer).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (boxContainer.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
  }

  public getVisibleRows(): void {
    let boxContainer = this.element.querySelector('.images-container') as HTMLElement;

    if (!boxContainer) {
      return;
    }

    let imageHeight: number = boxContainer.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(window.innerHeight / imageHeight);
    this.visibleImages = this.zoom * visibleRows;
  }

  public parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
