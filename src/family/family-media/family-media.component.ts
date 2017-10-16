import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import * as AppActions from '../../app/ngrx/app.actions';
import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  NgZone,
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
  UtilsService,
  UrlChangeService
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
export class FamilyMediaComponent implements OnDestroy, AfterViewInit {
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

  public query: string;
  public windowInnerWidth: number = window.innerWidth;
  public itemSize: number;
  public imageData: any = {};
  public imageBlockLocation: number;
  public showImageBlock: boolean = false;
  public activeImage: any;
  public prevImage: Object;
  public images: any = [];
  public familyPlaceServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public openFamilyExpandBlockSubscribe: Subscription;
  public footerHeight: number;
  public headerHeight: number;
  public imageOffsetHeight: any;
  public indexViewBoxImage: number;
  public element: HTMLElement;
  public imageResolution: ImageResolutionInterface;
  public visibleImages: number;
  public currentImages: any = [];
  public viewBlockHeight: number;
  public isDesktop: boolean;
  public familyComponent: FamilyComponent;
  public familyImageContainerElement: HTMLElement;
  public familyThingsContainerElement: HTMLElement;
  public familyImagesContainerElement: HTMLElement;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;

  public constructor(element: ElementRef,
                     viewContainerRef: ViewContainerRef,
                     private zone: NgZone,
                     private loaderService: LoaderService,
                     private familyMediaService: FamilyMediaService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private urlChangeService: UrlChangeService,
                     private store: Store<AppStates>) {
    this.element = element.nativeElement;
    this.familyComponent = (viewContainerRef as any)._data.componentView.parent.component as FamilyComponent;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.appState = this.store.select((appStates: AppStates) => appStates.app);
  }

  public ngAfterViewInit(): void {
    this.familyImageContainerElement = this.familyImagesContainer.nativeElement;
    this.familyThingsContainerElement = this.familyThingsContainer.nativeElement;
    this.familyImagesContainerElement = this.familyImagesContainer.nativeElement;

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (data.query) {
          if (this.query !== data.query) {
            this.query = data.query;
          }
        }
      }
    });

    const query: string = `placeId=${this.placeId}&resolution=${this.imageResolution.image}${this.languageService.getLanguageParam()}`;
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
        });

        if (this.activeImageIndex) {
          setTimeout(() => {
            this.calcItemSize();

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

          this.calcItemSize();

          if (this.indexViewBoxImage) {
            let countByIndex: number = (this.indexViewBoxImage + 1) % this.zoom;
            let offset: number = this.zoom - countByIndex;

            this.imageData.index = !countByIndex ? this.zoom : countByIndex;
            this.imageBlockLocation = countByIndex ? offset + this.indexViewBoxImage : this.indexViewBoxImage;

            const row: number = Math.ceil((this.indexViewBoxImage + 1) / this.zoom);
            this.goToRow(row);
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
          });
        }
      });

  }

  public ngOnDestroy(): void {
    this.familyPlaceServiceSubscribe.unsubscribe();
    this.resizeSubscribe.unsubscribe();

    if (this.openFamilyExpandBlockSubscribe) {
      this.openFamilyExpandBlockSubscribe.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }

  public changeZoom(prevZoom: number): void {
    setTimeout(() => {
      this.familyImageContainerElement.classList.remove('column-' + prevZoom);
      this.familyImageContainerElement.classList.add('column-' + this.zoom);

      this.calcItemSize();
    });
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

      this.changeUrl({row: row, activeImageIndex: this.indexViewBoxImage + 1});

      return;
    }

    if (isEqual(this.prevImage, image)) {
      this.showImageBlock = !this.showImageBlock;

      if (!this.showImageBlock) {
        this.prevImage = void 0;
      }

      this.changeUrl({row: row});
    } else {
      this.prevImage = image;
      this.showImageBlock = true;

      this.changeUrl({row: row, activeImageIndex: this.indexViewBoxImage + 1});
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

  public changeUrl(options: {row?: number, activeImageIndex?: number}): void {
    let {row, activeImageIndex} = options;

    if (row) {
      this.goToRow(row);
      this.activeImageOptions.emit({row: row, activeImageIndex: activeImageIndex});
    } else {
      this.activeImageOptions.emit({activeImageIndex: activeImageIndex});
    }

    let queryParams = this.utilsService.parseUrl(this.query);

    queryParams.place = this.imageData.placeId;

    let url = this.utilsService.objToQuery(queryParams);

    this.store.dispatch(new AppActions.SetQuery(url));

    this.urlChangeService.replaceState('/family', url);
  }

  public goToRow(row: number): void {
    if (!this.itemSize) {
      this.calcItemSize();
    }

    let header: HTMLElement = document.querySelector('.header-container') as HTMLElement;

    let homeDescription: HTMLElement = this.familyComponent.familyHeaderComponent.homeDescriptionContainer.nativeElement;
    let shortFamilyInfo: HTMLElement = this.familyComponent.familyHeaderComponent.shortFamilyInfoContainer.nativeElement;

    let headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;

    let scrollTop: number = row * this.itemSize + headerHeight;

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }, 0);
  }

  public calcItemSize(): void {
    if (!this.familyThingsContainerElement || !this.familyImageContainerElement) {
      return;
    }

    let widthScroll: number = window.innerWidth - document.body.offsetWidth;

    let imageMarginLeft: string = window.getComputedStyle(this.familyImageContainerElement).getPropertyValue('margin-left');
    let boxPaddingLeft: string = window.getComputedStyle(this.familyThingsContainerElement).getPropertyValue('padding-left');

    let imageMargin = parseFloat(imageMarginLeft) * 2;
    let boxContainerPadding: number = parseFloat(boxPaddingLeft) * 2;

    let imageHeight = (this.familyThingsContainerElement.offsetWidth - boxContainerPadding - widthScroll) / this.zoom - imageMargin;
    this.itemSize = imageHeight + imageMargin;

    this.loaderService.setLoader(true);
  }

  public getVisibleRows(): void {
    let imageHeight: number = this.familyThingsContainerElement.offsetWidth / this.zoom;
    let visibleRows: number = Math.round(window.innerHeight / imageHeight);

    this.visibleImages = this.zoom * visibleRows;
  }
}
