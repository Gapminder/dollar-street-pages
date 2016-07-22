import {
  Component,
  Input,
  EventEmitter,
  ElementRef,
  Inject,
  Output,
  OnInit,
  OnDestroy,
  OnChanges,
  NgZone
} from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { MatrixViewBlockComponent } from '../matrix-view-block/matrix-view-block.component';
import { Subject } from 'rxjs/Rx';

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

export class MatrixImagesComponent implements OnInit, OnDestroy, OnChanges {
  protected imageBlockLocation:any;
  protected indexViewBoxHouse:number;
  protected positionInRow:number;
  protected math:any;

  @Input('query')
  protected query:string;
  @Input('thing')
  protected thing:string;
  @Input('places')
  private places:Observable<any>;
  @Input('activeHouse')
  private activeHouse:number;
  @Input('zoom')
  private zoom:number;
  @Input('showblock')
  private showblock:boolean = false;
  @Input('clearActiveHomeViewBox')
  private clearActiveHomeViewBox:Subject<any>;

  @Output('hoverPlace')
  private hoverPlace:EventEmitter<any> = new EventEmitter<any>();
  @Output('activeHouseOptions')
  private activeHouseOptions:EventEmitter<any> = new EventEmitter<any>();

  private isDesktop:boolean = isDesktop;
  private oldPlaceId:string;
  private router:Router;
  private currentPlaces:any = [];
  private element:HTMLElement;
  private placesSubscribe:any;
  private itemSize:number;
  private imageHeight:number;
  private familyData:any;
  private prevPlaceId:string;
  private resizeSubscribe:any;
  private zone:NgZone;
  private clearActiveHomeViewBoxSubscribe:any;

  public constructor(@Inject(ElementRef) element:ElementRef,
                     @Inject(Router) router:Router,
                     @Inject('Math') math:any,
                     @Inject(NgZone) zone:NgZone) {
    this.element = element.nativeElement;
    this.router = router;
    this.math = math;
    this.zone = zone;
  }

  public ngOnInit():any {
    this.itemSize = (window.innerWidth - 36) / this.zoom;
    this.imageHeight = (window.innerWidth - 36) / this.zoom - 12;
    let isInit:boolean = true;

    this.placesSubscribe = this.places.subscribe((places:any) => {
      this.showblock = false;
      this.currentPlaces = places;

      if (this.activeHouse && isInit) {
        this.goToImageBlock(this.currentPlaces[this.activeHouse - 1], this.activeHouse - 1);
        isInit = false;
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.imageHeight = (window.innerWidth - 36) / this.zoom - 12;
        });
      });

    this.clearActiveHomeViewBoxSubscribe = this.clearActiveHomeViewBox &&
      this.clearActiveHomeViewBox.subscribe((isClean:any):void => {
        if (this.prevPlaceId && isClean) {
          this.prevPlaceId = void 0;
          this.familyData = void 0;
          this.imageBlockLocation = void 0;
          this.indexViewBoxHouse = void 0;
          this.showblock = void 0;
        }
      });
  }

  public ngOnChanges(changes:any):void {
    if (changes.zoom) {
      this.zone.run(() => {
        this.itemSize = (window.innerWidth - 36) / this.zoom;
        this.imageHeight = (window.innerWidth - 36) / this.zoom - 12;
      });
    }
  }

  public ngOnDestroy():void {
    this.placesSubscribe.unsubscribe();

    if (this.clearActiveHomeViewBoxSubscribe) {
      this.clearActiveHomeViewBoxSubscribe.unsubscribe();
    }
  }

  protected hoverImage(place:any):void {
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

  protected goToPlace(place:any):void {
    if (this.isDesktop) {
      this.router.navigate(['Home', this.parseUrl(`place=${place._id}&` + this.query)]);
      return;
    }

    if (!this.oldPlaceId) {
      this.oldPlaceId = place._id;
      return;
    }

    this.router.navigate(['Home', this.parseUrl(`place=${place._id}&` + this.query)]);
  }

  protected goToImageBlock(place:any, index:number):void {
    this.indexViewBoxHouse = index;
    this.positionInRow = (this.indexViewBoxHouse + 1) % this.zoom;
    let offset:number = this.zoom - this.positionInRow;

    this.imageBlockLocation = this.positionInRow ? offset + this.indexViewBoxHouse : this.indexViewBoxHouse;

    this.familyData = place;

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

  protected toUrl(image:any):string {
    return `url("${image}")`;
  }

  private changeUrl(row:number, activeHouseIndex?:number):void {
    this.activeHouseOptions.emit({row: row, activeHouseIndex: activeHouseIndex});
    this.hoverPlace.emit(undefined);
    this.hoverPlace.emit(this.familyData);
    this.goToRow(row);
  }

  private goToRow(row:number):void {
    let windowInnerWidth = window.innerWidth;
    let imageMargin = (windowInnerWidth - 36 - this.imageHeight * this.zoom) / this.zoom;

    document.body.scrollTop = document.documentElement.scrollTop = (row - 1) * (this.imageHeight + imageMargin) + 18;
  }

  private parseUrl(url:string):any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }
}
