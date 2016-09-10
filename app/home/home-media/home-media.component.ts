import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  Inject,
  EventEmitter,
  NgZone,
  AfterViewChecked,
  ElementRef
} from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription, Observable } from 'rxjs/Rx';
import { InfiniteScroll } from 'angular2-infinite-scroll';
import { RowLoaderComponent } from '../../common/row-loader/row-loader.component';
import { HomeMediaViewBlockComponent } from './home-media-view-block/home-media-view-block.component';
import { LoaderComponent } from '../../common/loader/loader.component';
import { Config, ImageResolutionInterface } from '../../app.config';
import { find, isEqual, slice, concat } from 'lodash';

let tpl = require('./home-media.template.html');
let style = require('./home-media.css');

@Component({
  selector: 'home-media',
  template: tpl,
  styles: [style],
  directives: [HomeMediaViewBlockComponent, RowLoaderComponent, LoaderComponent, InfiniteScroll]
})

export class HomeMediaComponent implements OnInit, OnDestroy, AfterViewChecked {
  protected loader: boolean = true;
  protected zoom: number = 4;

  protected itemSize: number;
  protected imageData: any = {};
  protected imageBlockLocation: number;
  protected showImageBlock: boolean = false;
  protected activeImage: any;
  protected rowLoaderStartPosition: number = 0;

  @Input('placeId')
  private placeId: string;
  @Input('activeImageIndex')
  private activeImageIndex: number;

  @Input('openFamilyExpandBlock')
  private openFamilyExpandBlock: Observable<any>;

  @Output('activeImageOptions')
  private activeImageOptions: EventEmitter<any> = new EventEmitter<any>();

  private prevImage: Object;
  private homeMediaService: any;
  private images: any = [];
  private familyPlaceServiceSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private openFamilyExpandBlockSubscribe: Subscription;
  private zone: NgZone;
  private imageHeight: number;
  private footerHeight: number;
  private headerHeight: number;
  private imageOffsetHeight: any;
  private isInit: boolean = true;
  private indexViewBoxImage: number;
  private windowInnerWidth: number = window.innerWidth;
  private element: HTMLElement;
  private imageMargin: number;
  private imageResolution: ImageResolutionInterface = Config.getImageResolution();
  private visibleImages: number;
  private currentImages: any = [];
  private viewBlockHeight: number;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     @Inject('HomeMediaService') homeMediaService: any) {
    this.homeMediaService = homeMediaService;
    this.zone = zone;
    this.element = element.nativeElement;
  }

  public ngOnInit(): void {
    this.openFamilyExpandBlockSubscribe = this.openFamilyExpandBlock && this
        .openFamilyExpandBlock
        .subscribe((data: any): void => {
          let familyImageIndex: number = 0;

          let familyImage: any = find(this.images, (image: any, index: number) => {
            if (image.thing === data.thingId) {
              familyImageIndex = index;

              return image;
            }
          });

          if (familyImage) {
            this.openMedia(familyImage, familyImageIndex);
          }
        });

    if (this.windowInnerWidth > 599 && this.windowInnerWidth < 1024) {
      this.zoom = 3;
    }

    if (this.windowInnerWidth <= 599) {
      this.zoom = 2;
    }

    this.familyPlaceServiceSubscribe = this.homeMediaService
      .getHomeMedia(`placeId=${this.placeId}&resolution=${this.imageResolution.image}`)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.images = res.data.images;
        this.imageData.photographer = res.data.photographer;

        setTimeout(() => {
          this.getVisibleRows();

          let numberSplice: number = this.visibleImages * 2;

          if (this.activeImageIndex && this.activeImageIndex > this.visibleImages) {
            let positionInRow: number = this.activeImageIndex % this.zoom;
            let offset: number = this.zoom - positionInRow;

            numberSplice = this.activeImageIndex + offset + this.visibleImages;
          }

          this.rowLoaderStartPosition = 0;

          this.currentImages = slice(this.images, 0, numberSplice);
        }, 0);
      });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.zone.run(() => {
          if (this.windowInnerWidth === window.innerWidth) {
            return;
          }

          this.zoom = 4;
          this.windowInnerWidth = window.innerWidth;

          if (this.windowInnerWidth > 599 && this.windowInnerWidth < 1024) {
            this.zoom = 3;
          }

          if (this.windowInnerWidth <= 599) {
            this.zoom = 2;
          }

          this.getImageHeight();

          if (this.indexViewBoxImage) {
            let countByIndex: number = (this.indexViewBoxImage + 1) % this.zoom;
            let offset: number = this.zoom - countByIndex;

            this.imageData.index = !countByIndex ? this.zoom : countByIndex;
            this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxImage : this.indexViewBoxImage;

            this.zone.run(() => this.goToRow(Math.ceil((this.indexViewBoxImage + 1) / this.zoom)));
          }
        });
      });
  }

  public ngAfterViewChecked(): void {
    let footer = document.querySelector('.footer') as HTMLElement;
    let imgContent = document.querySelector('.family-image-container') as HTMLElement;
    let headerContainer = document.querySelector('.header-container') as HTMLElement;

    if (!imgContent) {
      return;
    }

    if (this.headerHeight === headerContainer.offsetHeight && this.footerHeight === footer.offsetHeight &&
      this.imageOffsetHeight === imgContent.offsetHeight || !document.querySelector('.family-image-container')) {
      return;
    }

    this.headerHeight = headerContainer.offsetHeight;
    this.footerHeight = footer.offsetHeight;
    this.imageOffsetHeight = imgContent.offsetHeight;

    setTimeout(() => {
      this.getImageHeight();
      this.loader = false;
    }, 0);

    if (this.activeImageIndex && this.isInit) {
      this.isInit = false;

      setTimeout(() => this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1));
    }
  }

  public ngOnDestroy(): void {
    this.familyPlaceServiceSubscribe.unsubscribe();

    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.openFamilyExpandBlockSubscribe) {
      this.openFamilyExpandBlockSubscribe.unsubscribe();
    }
  }

  public onScrollDown(): void {
    if (this.currentImages.length && this.currentImages.length !== this.images.length) {
      let images: any = slice(this.images, this.currentImages.length, this.currentImages.length + this.visibleImages);

      this.currentImages = concat(this.currentImages, images);
      this.rowLoaderStartPosition = this.currentImages.length - this.visibleImages;
    }
  }

  protected openMedia(image: any, index: number): void {
    this.activeImage = image;
    this.indexViewBoxImage = index;
    let countByIndex: number = (this.indexViewBoxImage + 1) % this.zoom;
    let offset: number = this.zoom - countByIndex;

    this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxImage : this.indexViewBoxImage;

    this.imageData.index = !countByIndex ? this.zoom : countByIndex;
    this.imageData.placeId = this.placeId;
    this.imageData.imageId = image._id;
    this.imageData.thing = {
      _id: image.thing,
      plural: image.plural,
      thingName: image.thingName,
      icon: image.thingIcon.replace('FFFFFF', '2C4351')
    };

    this.imageData.image = image.background
      .replace(this.imageResolution.image, this.imageResolution.expand)
      .replace('url("', '')
      .replace('")', '');

    this.imageData = Object.assign({}, this.imageData);

    setTimeout(() => {
      let viewBlockBox = this.element.querySelector('home-media-view-block') as HTMLElement;

      this.viewBlockHeight = viewBlockBox ? viewBlockBox.offsetHeight : 0;
    }, 0);

    if (!this.prevImage) {
      this.prevImage = image;

      this.showImageBlock = !this.showImageBlock;

      this.changeUrl(Math.ceil((this.indexViewBoxImage + 1) / this.zoom), this.indexViewBoxImage + 1);

      return;
    }

    if (isEqual(this.prevImage, image)) {
      this.showImageBlock = !this.showImageBlock;

      if (!this.showImageBlock) {
        this.prevImage = void 0;
      }

      this.changeUrl();
    } else {
      this.prevImage = image;
      this.showImageBlock = true;

      this.changeUrl(Math.ceil((this.indexViewBoxImage + 1) / this.zoom), this.indexViewBoxImage + 1);
    }
  }

  protected imageIsUploaded(data: {index: number}): void {
    this.zone.run(() => {
      this.currentImages[data.index].isUploaded = true;
    });
  }

  private changeUrl(row?: number, activeImageIndex?: number): void {
    if (!row && !activeImageIndex) {
      this.activeImageOptions.emit({});

      return;
    }

    this.activeImageOptions.emit({activeImageIndex: activeImageIndex});
    this.goToRow(row);
  }

  private goToRow(row: number): void {
    let header = document.querySelector('.header-container') as HTMLElement;
    let homeDescription = document.querySelector('.home-description-container') as HTMLElement;
    let shortFamilyInfo = document.querySelector('.short-family-info-container') as HTMLElement;
    let headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;

    document.body.scrollTop = document.documentElement.scrollTop = row * this.itemSize + headerHeight - 45;
  }

  private getImageHeight(): void {
    let boxContainer = this.element.querySelector('.family-things-container') as HTMLElement;
    let imgContent = this.element.querySelector('.family-image-container') as HTMLElement;

    let widthScroll: number = window.innerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imgContent).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(boxContainer).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (boxContainer.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
  }

  private getVisibleRows(): void {
    let boxContainer = this.element.querySelector('.family-things-container') as HTMLElement;
    let headerContainer = document.querySelector('.header-container') as HTMLElement;
    let visibleSpace: number = window.innerHeight - headerContainer.offsetHeight;
    let imageHeight: number = boxContainer.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(visibleSpace / imageHeight);
    this.visibleImages = this.zoom * visibleRows;
  }
}
