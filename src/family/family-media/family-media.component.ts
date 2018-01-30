import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Store } from '@ngrx/store';
import {
  AppStates,
  MatrixState
} from '../../interfaces';
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
  ViewContainerRef,
} from '@angular/core';
import { find, isEqual, slice, concat, get, forEach } from 'lodash';
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
  public matrixSubscription: Subscription;

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

    const matrixState = this.store.select((state: AppStates) => state.matrix);

    this.matrixSubscription = matrixState
      .subscribe((matrix: MatrixState) => {
        if (!get(this, 'placeId', false)
          && get(matrix, 'place', false)) {
          this.placeId = matrix.place;
          this.zoom = matrix.zoom;

          const query = `placeId=${this.placeId}&resolution=${this.imageResolution.image}${this.languageService.getLanguageParam()}`;
          this.familyPlaceServiceSubscribe = this.familyMediaService
            .getFamilyMedia(query)
            .subscribe((res: any) => {
              if (res.err) {
                return;
              }

              this.images = res.data.images;
              this.imageData.photographer = res.data.photographer;
              // TODO: remove setTimeout on refactoring this component
              setTimeout(() => {
                this.getVisibleRows();
                this.calcItemSize()

                let numberSplice: number = this.visibleImages * 2;

                if (this.activeImageIndex && this.activeImageIndex > this.visibleImages) {
                  const positionInRow: number = this.activeImageIndex % this.zoom;
                  const offset: number = this.zoom - positionInRow;

                  numberSplice = this.activeImageIndex + offset + this.visibleImages;
                }
                this.currentImages = slice(this.images, 0, numberSplice);
                this.changeZoom(0);
              });

              if (this.activeImageIndex) {
                // TODO: remove setTimeout on refactoring this component
                setTimeout(() => {
                  this.loaderService.setLoader(true);

                  this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1);
                });
              }
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

          this.loaderService.setLoader(true);

          if (this.indexViewBoxImage) {
            const countByIndex = (this.indexViewBoxImage + 1) % this.zoom;
            const offset = this.zoom - countByIndex;

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
        let familyImageIndex = 0;

        const familyImage: any = find(this.images, (image, index: number) => {
          if (image.thing === data.thingId) {
            familyImageIndex = index;

            return image;
          }
        });

        if (familyImage) {
          let numberSplice = this.visibleImages * 2;

          if (familyImageIndex && familyImageIndex > this.visibleImages) {
            const positionInRow: number = familyImageIndex % this.zoom;
            const offset: number = this.zoom - positionInRow;

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
    if (this.familyPlaceServiceSubscribe) {
      this.familyPlaceServiceSubscribe.unsubscribe();
    }
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

      this.loaderService.setLoader(true);
      this.showImageBlock = false;
    });
  }

  public onScrollDown(): void {
    if (this.currentImages.length && this.currentImages.length !== this.images.length) {
      const images: any = slice(this.images, this.currentImages.length, this.currentImages.length + this.visibleImages);

      this.currentImages = concat(this.currentImages, images);
    }
  }

  public openMedia(image: any, index: number): void {
    this.activeImage = image;
    this.indexViewBoxImage = index;

    const countByIndex: number = (this.indexViewBoxImage + 1) % this.zoom;
    const offset: number = this.zoom - countByIndex;

    const row: number = Math.ceil((this.indexViewBoxImage + 1) / this.zoom);

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
        const viewBlockBox: HTMLElement = this.familyMediaViewBlock.element;

        this.viewBlockHeight = viewBlockBox ? viewBlockBox.offsetHeight : 0;
      }
    }, 0);

    if (!this.prevImage) {
      this.prevImage = image;
      this.showImageBlock = !this.showImageBlock;
      this.goToRow(row);

      return;
    }

    if (isEqual(this.prevImage, image)) {
      this.showImageBlock = !this.showImageBlock;

      if (!this.showImageBlock) {
        this.prevImage = void 0;
      }

    } else {
      this.prevImage = image;
      this.showImageBlock = true;
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

  public goToRow(row: number): void {
    this.calcItemSize();
    const header: HTMLElement = document.querySelector('.header-container') as HTMLElement;

    const homeDescription = this.familyComponent.familyHeaderComponent.homeDescriptionContainer.nativeElement;
    const shortFamilyInfo = this.familyComponent.familyHeaderComponent.shortFamilyInfoContainer.nativeElement;

    const headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;

    const scrollTop: number = row * this.itemSize + headerHeight;

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }, 0);
  }

  public calcItemSize(): void {
    if (!this.familyThingsContainerElement || !this.familyImageContainerElement) {
      return;
    }

    const imageContainer: HTMLElement = this.familyImageContainerElement.querySelector('.family-image-container');
    if (imageContainer) {
    this.itemSize = imageContainer.offsetHeight;
    }
  }

  public getVisibleRows(): void {
    const imageHeight = this.familyThingsContainerElement.offsetWidth / this.zoom;
    const visibleRows = Math.round(window.innerHeight / imageHeight);

    this.visibleImages = this.zoom * visibleRows;
  }
}
