import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  Inject,
  EventEmitter,
  NgZone,
  AfterViewChecked
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { HomeMediaViewBlockComponent } from './home-media-view-block/home-media-view-block.component';

let tpl = require('./home-media.template.html');
let style = require('./home-media.css');

@Component({
  selector: 'home-media',
  template: tpl,
  styles: [style],
  directives: [HomeMediaViewBlockComponent, RowLoaderComponent]
})

export class HomeMediaComponent implements OnInit, OnDestroy, AfterViewChecked {
  protected zoom:number = 4;
  protected itemSize:number;
  protected imageData:any = {};
  protected imageBlockLocation:number;
  protected showImageBlock:boolean = false;
  protected activeImage:any;

  @Input('placeId')
  private placeId:string;
  @Input('activeImageIndex')
  private activeImageIndex:number;

  @Output('activeImageOptions')
  private activeImageOptions:EventEmitter<any> = new EventEmitter();

  private prevImageId:string;
  private homeMediaService:any;
  private images:any = [];
  private familyPlaceServiceSubscribe:any;
  private resizeSubscribe:any;
  private zone:NgZone;
  private imageHeight:number;
  private windowHistory:any = history;
  private footerHeight:any;
  private imageOffsetHeight:any;
  private isInit:boolean = true;
  private indexViewBoxImage:number;

  public constructor(@Inject('HomeMediaService') homeMediaService:any,
                     @Inject(NgZone) zone:NgZone) {
    this.homeMediaService = homeMediaService;
    this.zone = zone;
  }

  public ngOnInit():void {
    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'manual';
    }

    if (window.innerWidth < 1024) {
      this.zoom = 3;
    }

    this.itemSize = window.innerWidth / this.zoom;
    this.imageHeight = (window.innerWidth - 32) / this.zoom;

    this.familyPlaceServiceSubscribe = this.homeMediaService.getHomeMedia(`placeId=${this.placeId}`)
      .subscribe((res:any) => {
        if (res.err) {
          return res.err;
        }

        this.images = res.data.images;
        this.imageData.photographer = res.data.photographer;
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          this.imageHeight = (window.innerWidth - 32) / this.zoom;
        });
      });
  }

  public ngAfterViewChecked():void {
    if (!this.activeImageIndex || !this.isInit) {
      this.isInit = false;

      return;
    }

    let footer = document.querySelector('.footer') as HTMLElement;
    let imgContent = document.querySelector('.family-image-container') as HTMLElement;

    if (!imgContent) {
      return;
    }

    if (this.footerHeight === footer.offsetHeight &&
      this.imageOffsetHeight === imgContent.offsetHeight || !document.querySelector('.family-image-container')) {
      return;
    }

    this.footerHeight = footer.offsetHeight;
    this.imageOffsetHeight = imgContent.offsetHeight;

    if (this.isInit) {
      this.isInit = false;

      setTimeout(() => {
        this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1);
      });
    }
  }

  public ngOnDestroy():void {
    this.familyPlaceServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if ('scrollRestoration' in history) {
      this.windowHistory.scrollRestoration = 'auto';
    }
  }

  protected openMedia(image:any, index:number):void {
    this.activeImage = image;
    this.indexViewBoxImage = index;
    let countByIndex:number = (this.indexViewBoxImage + 1) % this.zoom;
    let offset:number = this.zoom - countByIndex;

    this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxImage : this.indexViewBoxImage;

    this.imageData.index = !countByIndex ? this.zoom : countByIndex;
    this.imageData.thing = {
      name: image.thingName,
      icon: image.thingIcon.replace('FFFFFF', '2C4351')
    };

    this.imageData.image = image.background
      .replace('thumb', 'desktops')
      .replace('url("', '')
      .replace('")', '');

    this.imageData = Object.assign({}, this.imageData);

    if (!this.prevImageId) {
      this.prevImageId = image._id;
      this.showImageBlock = !this.showImageBlock;

      this.changeUrl(Math.ceil((this.indexViewBoxImage + 1) / this.zoom), this.indexViewBoxImage + 1);

      return;
    }

    if (this.prevImageId === image._id) {
      this.showImageBlock = !this.showImageBlock;

      if (!this.showImageBlock) {
        this.prevImageId = '';
      }

      this.changeUrl();
    } else {
      this.prevImageId = image._id;
      this.showImageBlock = true;

      this.changeUrl(Math.ceil((this.indexViewBoxImage + 1) / this.zoom), this.indexViewBoxImage + 1);
    }
  }

  private changeUrl(row?:number, activeImageIndex?:number):void {
    if (!row && !activeImageIndex) {
      this.activeImageOptions.emit({});

      return;
    }

    this.activeImageOptions.emit({activeImageIndex: activeImageIndex});
    this.goToRow(row);
  }

  private goToRow(row:number):void {
    let header = document.querySelector('.home-description-container') as HTMLElement;
    let shortFamilyInfo = document.querySelector('.short-family-info-container') as HTMLElement;

    document.body.scrollTop = (row - 1) * this.imageHeight + header.offsetHeight - shortFamilyInfo.offsetHeight + 16;
  }
}
