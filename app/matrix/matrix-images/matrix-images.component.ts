import { Component, Input, EventEmitter, ElementRef, Inject, Output, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { MatrixViewBlockComponent } from '../matrix-view-block/matrix-view-block.component';
import { Subject, Subscription } from 'rxjs/Rx';

const device = require('device.js')();
const isDesktop = device.desktop();

let tpl = require('./matrix-images.template.html');
let style = require('./matrix-images.css');

@Component({
  selector: 'matrix-images',
  template: tpl,
  styles: [style],
  directives: [RowLoaderComponent, MatrixViewBlockComponent]
})

export class MatrixImagesComponent implements OnInit, OnDestroy {
  protected imageBlockLocation: any;
  protected indexViewBoxHouse: number;
  protected positionInRow: number;
  protected math: any;
  protected Angulartics2GoogleAnalytics: any;

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
  @Input('clearActiveHomeViewBox')
  private clearActiveHomeViewBox: Subject<any>;

  @Output('hoverPlace')
  private hoverPlace: EventEmitter<any> = new EventEmitter<any>();
  @Output('activeHouseOptions')
  private activeHouseOptions: EventEmitter<any> = new EventEmitter<any>();

  private isDesktop: boolean = isDesktop;
  private oldPlaceId: string;
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

  public constructor(@Inject(ElementRef) element: ElementRef,
                     @Inject(Router) router: Router,
                     @Inject('Math') math: any,
                     @Inject('Angulartics2GoogleAnalytics') Angulartics2GoogleAnalytics: any,
                     @Inject(NgZone) zone: NgZone) {
    this.element = element.nativeElement;
    this.router = router;
    this.math = math;
    this.Angulartics2GoogleAnalytics = Angulartics2GoogleAnalytics;
    this.zone = zone;
  }

  public ngOnInit(): any {
    let isInit: boolean = true;

    this.placesSubscribe = this.places.subscribe((places: any) => {
      this.showblock = false;
      this.currentPlaces = places;

      setTimeout(() => {
        this.getImageHeight();
      }, 0);

      if (this.activeHouse && isInit) {
        setTimeout(() => {
          this.goToImageBlock(this.currentPlaces[this.activeHouse - 1], this.activeHouse - 1);
          isInit = false;
        }, 0);
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;
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

    if (this.resizeSubscribe.unsubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }
  }

  protected hoverImage(place: any): void {
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

    if (!place) {
      this.oldPlaceId = void 0;
    }
  }

  protected goToPlace(place: any): void {
    if (this.isDesktop) {
      this.Angulartics2GoogleAnalytics.eventTrack(`Go to  Place page from Matrix page `);
      this.router.navigate(['/family'], {queryParams: this.parseUrl(`place=${place._id}&` + this.query)});
      return;
    }

    if (!this.oldPlaceId) {
      this.oldPlaceId = place._id;
      return;
    }
    this.Angulartics2GoogleAnalytics.eventTrack(`Go to  Place page from Matrix page `);

    this.router.navigate(['/family'], {queryParams: this.parseUrl(`place=${place._id}&` + this.query)});
  }

  protected goToImageBlock(place: any, index: number): void {
    this.indexViewBoxHouse = index;
    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;
    let offset: number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = JSON.parse(JSON.stringify(place));

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

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  private getImageHeight(): void {
    let boxContainer = this.element.querySelector('.images-container') as HTMLElement;
    let imgContent = this.element.querySelector('.image-content') as HTMLElement;

    let widthScroll: number = this.windowInnerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imgContent).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(boxContainer).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (boxContainer.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
  }
}
