import { Component, Input, EventEmitter, ElementRef, Inject, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { MatrixViewBlockComponent } from '../matrix-view-block/matrix-view-block.component';
import { Subject, Subscription } from 'rxjs/Rx';
import { concat, slice } from 'lodash';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [RowLoaderComponent, MatrixViewBlockComponent, InfiniteScroll]
})

export class MatrixImagesComponent implements OnInit, OnDestroy {
  protected imageBlockLocation: any;
  protected indexViewBoxHouse: number;
  protected positionInRow: number;
  protected math: any;
  protected angulartics2GoogleAnalytics: any;
  protected placesArr: any = [];
  protected viewBlockHeight: number;
  protected rowLoaderStartPosition: number = 0;

  @Input('query')
  protected query: string;
  @Input('thing')
  protected thing: string;
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
  @Input('clearActiveHomeViewBox')
  private clearActiveHomeViewBox: Subject<any>;

  @Output('hoverPlace')
  private hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output('activeHouseOptions')
  private activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();

  private isDesktop: boolean = isDesktop;
  private router: Router;
  private currentPlaces: any = [];
  private element: HTMLElement;
  private placesSubscribe: Subscription;
  private itemSize: number;
  private imageHeight: number;
  private familyData: any;
  private prevPlaceId: string;
  private resizeSubscribe: Subscription;
  private zone: NgZone;
  private clearActiveHomeViewBoxSubscribe: Subscription;
  private imageMargin: number;
  private windowInnerWidth: number = window.innerWidth;
  private visibleImages: number;
  private loaderService: any;

  public constructor(zone: NgZone,
                     router: Router,
                     element: ElementRef,
                     @Inject('Math') math: any,
                     @Inject('LoaderService') loaderService: any,
                     @Inject('Angulartics2GoogleAnalytics') angulartics2GoogleAnalytics: any) {
    this.zone = zone;
    this.math = math;
    this.router = router;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
  }

  public ngOnInit(): any {
    let isInit: boolean = true;

    this.placesSubscribe = this.places.subscribe((places: any) => {
      this.showblock = false;
      this.currentPlaces = places;

      setTimeout(() => {
        this.getVisibleRows();

        let numberSplice: number = this.visibleImages * 2;

        if (this.row && this.row > 1) {
          numberSplice = this.row * this.zoom + this.visibleImages;
        }

        if (this.activeHouse && this.activeHouse > this.visibleImages) {
          let positionInRow: number = this.activeHouse % this.zoom;
          let offset: number = this.zoom - positionInRow;

          numberSplice = this.activeHouse + offset + this.visibleImages;
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
          this.goToImageBlock(this.currentPlaces[this.activeHouse - 1], this.activeHouse - 1);
          isInit = false;
        }, 0);
      }
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

  protected imageIsUploaded(data: {index: number}): void {
    this.zone.run(() => {
      this.placesArr[data.index].isUploaded = true;
    });
  }

  protected goToImageBlock(place: any, index: number): void {
    this.indexViewBoxHouse = index;
    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;
    let offset: number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = JSON.parse(JSON.stringify(place));

    setTimeout(() => {
      let viewBlockBox = this.element.querySelector('matrix-view-block') as HTMLElement;

      this.viewBlockHeight = viewBlockBox ? viewBlockBox.offsetHeight : 0;
    }, 0);

    if (!this.prevPlaceId) {
      this.prevPlaceId = place._id;
      this.showblock = !this.showblock;

      this.changeUrl(Math.ceil((this.indexViewBoxHouse + 1) / this.zoom), this.indexViewBoxHouse + 1);

      return;
    }

    if (this.prevPlaceId === place._id) {
      this.showblock = !this.showblock;

      if (!this.showblock) {
        this.prevPlaceId = '';
      }

      this.changeUrl(Math.ceil((this.indexViewBoxHouse + 1) / this.zoom));
    } else {
      this.prevPlaceId = place._id;
      this.showblock = true;

      this.changeUrl(Math.ceil((this.indexViewBoxHouse + 1) / this.zoom), this.indexViewBoxHouse + 1);
    }
  }

  protected toUrl(image: any): string {
    return `url("${image}")`;
  }

  private changeUrl(row: number, activeHouseIndex?: number): void {
    this.activeHouseOptions.emit({row: row, activeHouseIndex: activeHouseIndex});
    this.hoverPlace.emit(undefined);
    this.hoverPlace.emit(this.familyData);

    this.goToRow(row);
  }

  private goToRow(row: number): void {
    let showPartPrevImage: number = 60;

    if (this.windowInnerWidth < 600) {
      showPartPrevImage = -20;
    }

    document.body.scrollTop = document.documentElement.scrollTop = row * this.itemSize - showPartPrevImage;
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
}
