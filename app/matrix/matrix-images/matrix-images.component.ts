import { Component, Input, EventEmitter, ElementRef, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject, Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';
import { concat, slice } from 'lodash';
import { MathService } from '../../common/math-service/math-service';
import { LoaderService } from '../../common/loader/loader.service';
import { CountriesFilterService } from '../../common/countries-filter/countries-filter.service';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style]
})

export class MatrixImagesComponent implements OnInit, OnDestroy {
  @Input('query')
  private query: string;
  @Input('thing')
  private thing: string;
  @Input('places')
  private places: Observable<any>;
  @Input('activeHouse')
  private activeHouse: number;
  @Input('zoom')
  private zoom: number;
  @Input('showblock')
  private showblock: boolean = false;
  @Input('row')
  private row: number;
  @Input('guidePositionTop')
  private guidePositionTop: number;
  @Input('clearActiveHomeViewBox')
  private clearActiveHomeViewBox: Subject<any>;

  @Output('hoverPlace')
  private hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output('activeHouseOptions')
  private activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output('filter')
  private filter: EventEmitter<any> = new EventEmitter<any>();

  private selectedCountries: any;
  private selectedRegions: any;
  private activeCountries: any;
  private selectedThing: any;
  private imageBlockLocation: any;
  private indexViewBoxHouse: number;
  private positionInRow: number;
  private math: MathService;
  private showErrorMsg: boolean = false;
  private errorMsg: any;
  private placesArr: any = [];
  private viewBlockHeight: number;
  private rowLoaderStartPosition: number = 0;
  private isDesktop: boolean = isDesktop;
  private router: Router;
  private currentPlaces: any = [];
  private element: HTMLElement;
  private placesSubscribe: Subscription;
  private itemSize: number;
  private imageHeight: number;
  private countriesFilterService: CountriesFilterService;
  private countriesFilterServiceSubscribe: Subscription;
  private familyData: any;
  private prevPlaceId: string;
  private resizeSubscribe: Subscription;
  private zone: NgZone;
  private clearActiveHomeViewBoxSubscribe: Subscription;
  private imageMargin: number;
  private windowInnerWidth: number = window.innerWidth;
  private visibleImages: number;
  private loaderService: LoaderService;
  private locations: any;

  public constructor(zone: NgZone,
                     router: Router,
                     element: ElementRef,
                     math: MathService,
                     loaderService: LoaderService,
                     countriesFilterService: CountriesFilterService) {
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.loaderService = loaderService;
    this.countriesFilterService = countriesFilterService;
    this.element = element.nativeElement;
  }

  public ngOnInit(): any {
    let isInit: boolean = true;

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

        this.rowLoaderStartPosition = 0;

        this.placesArr = slice(this.currentPlaces, 0, numberSplice);
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
      .getCountries(`thing=${this.thing}`)
      .subscribe((res: any): any => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.locations = res.data;
      });

    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
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
    this.placesSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();

    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }
  }

  public onScrollDown(): void {
    if (this.placesArr.length && this.placesArr.length !== this.currentPlaces.length) {
      let places: any = slice(this.currentPlaces, this.placesArr.length, this.placesArr.length + this.visibleImages);
      this.placesArr = concat(this.placesArr, places);
      this.rowLoaderStartPosition = this.placesArr.length - this.visibleImages;
    }
  }

  protected hoverImage(place: any): void {
    if (!isDesktop) {
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

  public buildTitle(query: any): any {
    let regions = query.regions.split(',');
    let countries = query.countries.split(',');
    this.selectedThing = query.thing.split(',');
    if (regions[0] === 'World' && countries[0] === 'World') {
      this.activeCountries = 'the world';

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
        this.activeCountries = 'the world';
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

  protected imageIsUploaded(data: {index: number}): void {
    this.zone.run(() => {
      this.placesArr[data.index].isUploaded = true;
    });
  }

  protected buildErrorMsg(places: any): void {
    if (!places.length) {
      this.buildTitle(this.parseUrl(this.query));

      let activeCountries = this.activeCountries.toString().replace(/,/g, ', ');

      if (this.activeCountries === 'the world') {

        this.showErrorMsg = true;
        this.errorMsg = 'Sorry, we have no ' + this.selectedThing.toString().toLowerCase() + ' on this income yet.';
        return;
      } else {

        if (!this.selectedRegions) {

          this.showErrorMsg = true;
          this.errorMsg = 'Sorry, there is no data by this query yet!';
          return;
        }

        this.showErrorMsg = true;
        this.errorMsg = 'Sorry, we have no ' + this.selectedThing.toString().toLowerCase() + ' in ' + activeCountries + ' on this income yet.';
        return;
      }
    }
  }

  protected goToImageBlock(place: any, index: number, isInit?: boolean): void {
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

  protected toUrl(image: any): string {
    return `url("${image}")`;
  }

  protected goToMatrixWithCountry(params: any): void {
    this.filter.emit(params);
  }

  private changeUrl(options: {row?: number, activeHouseIndex?: number}): void {
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

  private goToRow(row: number): void {
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

  private getImageHeight(): void {
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

  private getVisibleRows(): void {
    let boxContainer = this.element.querySelector('.images-container') as HTMLElement;

    if (!boxContainer) {
      return;
    }

    let imageHeight: number = boxContainer.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(window.innerHeight / imageHeight);
    this.visibleImages = this.zoom * visibleRows;
  }

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
