import 'rxjs/operator/debounceTime';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  NgZone,
  AfterViewChecked,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { find, isEqual, slice, concat } from 'lodash';
import { Config, ImageResolutionInterface } from '../../app.config';
import { LoaderService, BrowserDetectionService } from '../../common';
import { FamilyMediaService } from './family-media.service';
import { LanguageService } from '../../common';

@Component({
  selector: 'family-media',
  templateUrl: './family-media.component.html',
  styleUrls: ['./family-media.component.css']
})

export class FamilyMediaComponent implements OnInit, OnDestroy, AfterViewChecked {
  public windowInnerWidth: number = window.innerWidth;
  public itemSize: number;
  public imageData: any = {};
  public imageBlockLocation: number;
  public showImageBlock: boolean = false;
  public activeImage: any;
  public zoom: number = this.windowInnerWidth < 1024 ? 3 : 4;
  public prevImage: Object;
  public familyMediaService: FamilyMediaService;
  public images: any = [];
  public familyPlaceServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public openFamilyExpandBlockSubscribe: Subscription;
  public zone: NgZone;
  public imageHeight: number;
  public footerHeight: number;
  public headerHeight: number;
  public imageOffsetHeight: any;
  public isInit: boolean = true;
  public indexViewBoxImage: number;
  public element: HTMLElement;
  public imageMargin: number;
  public imageResolution: ImageResolutionInterface;
  public visibleImages: number;
  public currentImages: any = [];
  public viewBlockHeight: number;
  public loaderService: LoaderService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;

  @Input('placeId')
  public placeId: string;
  @Input('activeImageIndex')
  public activeImageIndex: number;
  @Input('openFamilyExpandBlock')
  public openFamilyExpandBlock: Observable<any>;

  @Output('activeImageOptions')
  public activeImageOptions: EventEmitter<any> = new EventEmitter<any>();
  public languageService: LanguageService;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     loaderService: LoaderService,
                     familyMediaService: FamilyMediaService,
                     browserDetectionService: BrowserDetectionService,
                     languageService: LanguageService) {
    this.familyMediaService = familyMediaService;
    this.zone = zone;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.languageService = languageService;

    this.isDesktop = this.device.isDesktop();
    this.imageResolution = Config.getImageResolution(this.isDesktop);
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
            let numberSplice: number = this.visibleImages * 2;

            if (familyImageIndex && familyImageIndex > this.visibleImages) {
              let positionInRow: number = familyImageIndex % this.zoom;
              let offset: number = this.zoom - positionInRow;

              numberSplice = familyImageIndex + offset + this.visibleImages;
            }

            this.currentImages = slice(this.images, 0, numberSplice);

            setTimeout(() => {
              this.openMedia(familyImage, familyImageIndex);
            }, 0);
          }
        });

    const query: string = `placeId=${this.placeId}&resolution=${this.
      imageResolution.image}${this.languageService.getLanguageParam()}`;

    this.familyPlaceServiceSubscribe = this.familyMediaService
      .getFamilyMedia(query)
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

          this.windowInnerWidth = window.innerWidth;
          this.zoom = this.windowInnerWidth < 1024 ? 3 : 4;

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
    }, 0);

    if (this.activeImageIndex && this.isInit) {
      this.isInit = false;

      setTimeout(() => this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1));
    }
  }

  public ngOnDestroy(): void {
    this.familyPlaceServiceSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();

    if (this.openFamilyExpandBlockSubscribe) {
      this.openFamilyExpandBlockSubscribe.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }

  public onScrollDown(): void {
    if (this.currentImages.length && this.currentImages.length !== this.images.length) {
      let images: any = slice(this.images, this.currentImages.length, this.currentImages.length + this.visibleImages);

      this.currentImages = concat(this.currentImages, images);
    }
  }

  public openMedia(image: any, index: number): void {
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
      let viewBlockBox = this.element.querySelector('family-media-view-block') as HTMLElement;

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

  public convertImageUrlWithoutWrapper(urlToConvert: string): string {
    return urlToConvert.replace('url("', '')
      .replace('")', '');
  }

  public imageIsUploaded(index: number): void {
    this.zone.run(() => {
      this.currentImages[index].isUploaded = true;
    });
  }

  public changeUrl(row?: number, activeImageIndex?: number): void {
    if (!row && !activeImageIndex) {
      this.activeImageOptions.emit({});

      return;
    }

    this.activeImageOptions.emit({activeImageIndex: activeImageIndex});
    this.goToRow(row);
  }

  public goToRow(row: number): void {
    let header = document.querySelector('.header-container') as HTMLElement;
    let homeDescription = document.querySelector('.home-description-container') as HTMLElement;
    let shortFamilyInfo = document.querySelector('.short-family-info-container') as HTMLElement;
    let headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;

    document.body.scrollTop = document.documentElement.scrollTop = row * this.itemSize + headerHeight - 45;
  }

  public getImageHeight(): void {
    let boxContainer = this.element.querySelector('.family-things-container') as HTMLElement;
    let imgContent = this.element.querySelector('.family-image-container') as HTMLElement;

    let widthScroll: number = window.innerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(imgContent).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(boxContainer).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (boxContainer.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
    this.loaderService.setLoader(true);
  }

  public getVisibleRows(): void {
    let boxContainer = this.element.querySelector('.family-things-container') as HTMLElement;
    let imageHeight: number = boxContainer.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(window.innerHeight / imageHeight);
    this.visibleImages = this.zoom * visibleRows;
  }
}
