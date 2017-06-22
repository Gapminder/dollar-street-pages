import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';

import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  NgZone,
  AfterViewChecked,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { find, isEqual, slice, concat } from 'lodash';

import {
  LoaderService,
  BrowserDetectionService,
  LanguageService,
  UtilsService
} from '../../common';

import { FamilyMediaService } from './family-media.service';

import { FamilyComponent } from '../family.component';
import { FamilyMediaViewBlockComponent } from './family-media-view-block';

import { ImageResolutionInterface } from '../../interfaces';

@Component({
  selector: 'family-media',
  templateUrl: './family-media.component.html',
  styleUrls: ['./family-media.component.css']
})

export class FamilyMediaComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(FamilyMediaViewBlockComponent)
  public familyMediaViewBlock: FamilyMediaViewBlockComponent;
  @ViewChild('familyImageContainer')
  public familyImageContainer: ElementRef;
  @ViewChild('familyImagesContainer')
  public familyImagesContainer: ElementRef;
  @ViewChild('familyThingsContainer')
  public familyThingsContainer: ElementRef;

  @Input()
  public placeId: string;
  @Input()
  public activeImageIndex: number;
  @Input()
  public openFamilyExpandBlock: Observable<any>;
  @Input()
  public zoom: number;

  @Output()
  public activeImageOptions: EventEmitter<any> = new EventEmitter<any>();

  public windowInnerWidth: number = window.innerWidth;
  public itemSize: number;
  public imageData: any = {};
  public imageBlockLocation: number;
  public showImageBlock: boolean = false;
  public activeImage: any;
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
  public indexViewBoxImage: number;
  public element: HTMLElement;
  public imageMargin: number;
  public imageResolution: ImageResolutionInterface;
  public visibleImages: number;
  public currentImages: any = [];
  public viewBlockHeight: number;
  public loaderService: LoaderService;
  public languageService: LanguageService;
  public utilsService: UtilsService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public familyComponent: FamilyComponent;
  public familyImageContainerElement: HTMLElement;
  public familyThingsContainerElement: HTMLElement;
  public familyImagesContainerElement: HTMLElement;

  public constructor(zone: NgZone,
                     element: ElementRef,
                     loaderService: LoaderService,
                     familyMediaService: FamilyMediaService,
                     browserDetectionService: BrowserDetectionService,
                     languageService: LanguageService,
                     utilsService: UtilsService,
                     viewContainerRef: ViewContainerRef) {
    this.familyMediaService = familyMediaService;
    this.zone = zone;
    this.loaderService = loaderService;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.languageService = languageService;
    this.utilsService = utilsService;
    this.familyComponent = (viewContainerRef as any)._data.componentView.parent.component as FamilyComponent;

    this.isDesktop = this.device.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);
  }

  public ngAfterViewInit(): void {
    this.familyImageContainerElement = this.familyImagesContainer.nativeElement;
    this.familyThingsContainerElement = this.familyThingsContainer.nativeElement;
    this.familyImagesContainerElement = this.familyImagesContainer.nativeElement;

    setTimeout(() => {
      if (!this.familyImagesContainer) {
        return;
      }

      this.familyImagesContainerElement.classList.add('column-' + this.zoom);
      this.loaderService.setLoader(true);
    }, 0);

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

          this.changeZoom(0);
        }, 0);

        if (this.activeImageIndex) {
          setTimeout(() => {
            this.getImageHeight();

            this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1);
          });
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

          this.getImageHeight();

          if (this.indexViewBoxImage) {
            let countByIndex: number = (this.indexViewBoxImage + 1) % this.zoom;
            let offset: number = this.zoom - countByIndex;

            this.imageData.index = !countByIndex ? this.zoom : countByIndex;
            this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxImage : this.indexViewBoxImage;

            const row: number = Math.ceil((this.indexViewBoxImage + 1) / this.zoom);

            this.zone.run(() => this.goToRow(row));
          }
        });
      });

      /*tslint:disable-next-line*/
      this.openFamilyExpandBlockSubscribe = this.openFamilyExpandBlock && this.openFamilyExpandBlock
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
  }

  public ngAfterViewChecked(): void {
    if (!this.familyImageContainer) {
      return;
    }

    let headerContainer: HTMLElement = document.querySelector('.header-container') as HTMLElement;
    let footer: HTMLElement = document.querySelector('.footer') as HTMLElement;

    if (this.headerHeight === headerContainer.offsetHeight && this.footerHeight === footer.offsetHeight &&
      this.imageOffsetHeight === this.familyImageContainerElement.offsetHeight || !this.familyImageContainerElement) {
      return;
    }

    this.headerHeight = headerContainer.offsetHeight;
    this.footerHeight = footer.offsetHeight;
    this.imageOffsetHeight = this.familyImageContainerElement.offsetHeight;

    setTimeout(() => {
      this.getImageHeight();
    }, 0);

    if (this.activeImageIndex) {
      const row: number = Math.ceil((this.indexViewBoxImage + 1) / this.zoom);

      this.goToRow(row);
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

  public changeZoom(prevZoom: number): void {
    setTimeout(() => {
      this.familyImageContainerElement.classList.remove('column-' + prevZoom);
      this.familyImageContainerElement.classList.add('column-' + this.zoom);

      this.getImageHeight();
    },0);
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

    let row: number = Math.ceil((this.indexViewBoxImage + 1) / this.zoom);

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
      if (this.familyMediaViewBlock) {
        let viewBlockBox: HTMLElement = this.familyMediaViewBlock.element;

        this.viewBlockHeight = viewBlockBox ? viewBlockBox.offsetHeight : 0;
      }
    }, 0);

    if (!this.prevImage) {
      this.prevImage = image;

      this.showImageBlock = !this.showImageBlock;

      this.changeUrl(row, this.indexViewBoxImage + 1);

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

      this.changeUrl(row, this.indexViewBoxImage + 1);
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
    let header: HTMLElement = document.querySelector('.header-container') as HTMLElement;

    let homeDescription: HTMLElement = this.familyComponent.familyHeaderComponent.homeDescriptionContainer.nativeElement;
    let shortFamilyInfo: HTMLElement = this.familyComponent.familyHeaderComponent.shortFamilyInfoContainer.nativeElement;

    let headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;

    let scrollTop: number = row * this.itemSize;

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop  + headerHeight - 45;
    }, 0);
  }

  public getImageHeight(): void {
    if (!this.familyThingsContainerElement || !this.familyImageContainerElement) {
      return;
    }

    let widthScroll: number = window.innerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(this.familyImageContainerElement).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(this.familyThingsContainerElement).getPropertyValue('padding-left');

    this.imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    this.imageHeight = (this.familyThingsContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - this.imageMargin;
    this.itemSize = this.imageHeight + this.imageMargin;
    this.loaderService.setLoader(true);
  }

  public getVisibleRows(): void {
    let imageHeight: number = this.familyThingsContainerElement.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(window.innerHeight / imageHeight);

    this.visibleImages = this.zoom * visibleRows;
  }
}
