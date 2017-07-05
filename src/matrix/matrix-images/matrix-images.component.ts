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
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MatrixViewBlockComponent } from '../matrix-view-block/matrix-view-block.component';
import {
  MathService,
  LoaderService,
  LanguageService,
  BrowserDetectionService
} from '../../common';
import { Store } from '@ngrx/store';
import { AppStore } from '../../interfaces';

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
  public query: string;
  @Input()
  public thing: string;
  @Input()
  public places: Observable<any>;
  @Input()
  public activeHouse: number;
  @Input()
  public zoom: number;
  @Input()
  public showblock: boolean = false;
  @Input()
  public row: number;
  @Input()
  public guidePositionTop: number;
  @Input()
  public clearActiveHomeViewBox: Subject<any>;

  @Output()
  public hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public filter: EventEmitter<any> = new EventEmitter<any>();

  public languageService: LanguageService;
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
  public getTranslationSubscribe: Subscription;

  public constructor(zone: NgZone,
                     router: Router,
                     element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     browserDetectionService: BrowserDetectionService,
                     languageService: LanguageService) {
    this.languageService = languageService;
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.loaderService = loaderService;
    this.device = browserDetectionService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): any {
    let isInit: boolean = true;

    this.isDesktop = this.device.isDesktop();

    this.getTranslationSubscribe = this.languageService.getTranslation(['THE_WORLD', 'SORRY_WE_HAVE_NO', 'ON_THIS_INCOME_YET', 'ON_THIS_INCOME_YET', 'IN']).subscribe((trans: any) => {
      this.sorryWeHaveNoTranslate = trans.SORRY_WE_HAVE_NO;
      this.onThisIncomeYetTranslate = trans.ON_THIS_INCOME_YET;
      this.theWorldTranslate = trans.THE_WORLD;
      this.inTranslate = trans.IN;

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
    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }

    this.getTranslationSubscribe.unsubscribe();

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

  public buildTitle(query: any): any {
    let regions = query.regions.split(',');
    let countries = query.countries.split(',');
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
      this.buildTitle(this.parseUrl(this.query));

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

  public goToImageBlock(place: any, index: number, isInit?: boolean): void {
    this.indexViewBoxHouse = index;

    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;

    let offset: number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = JSON.parse(JSON.stringify(place));

    setTimeout(() => {
      this.viewBlockHeight = this.matrixViewBlockComponent ? this.matrixViewBlockComponent.element.offsetHeight : 0;
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
    let imagesContainerElement: HTMLElement = this.imagesContainer.nativeElement;
    let imageContentElement: HTMLElement = this.imageContent.nativeElement;

    if (!imagesContainerElement || !imageContentElement) {
      return;
    }

    let widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imageContentElement).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(imagesContainerElement).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (imagesContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
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

  public parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
