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
  ViewContainerRef, ViewChildren, QueryList,
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
import { DEBOUNCE_TIME, DefaultUrlParameters } from '../../defaultState';
import { PagePositionService } from "../../shared/page-position/page-position.service";
import { UrlParametersService } from "../../url-parameters/url-parameters.service";
import {combineLatest} from "rxjs/observable/combineLatest";
import { Router } from '@angular/router';


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

  @ViewChildren(FamilyMediaComponent)
  viewChildren: QueryList<FamilyMediaComponent>;

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
  combineSubscription: Subscription;
  currentLanguage: string;

  public constructor(element: ElementRef,
                     viewContainerRef: ViewContainerRef,
                     private zone: NgZone,
                     private router: Router,
                     private loaderService: LoaderService,
                     private familyMediaService: FamilyMediaService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private urlChangeService: UrlChangeService,
                     private store: Store<AppStates>,
                     private pagePositionService: PagePositionService,
                     private urlParametersService: UrlParametersService) {
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
    const languageState = this.store.select((state: AppStates) => state.language);

    this.combineSubscription = combineLatest(matrixState, languageState).subscribe(arr => {
      const matrix = arr[0];
      const language = arr[1];

      if (this.zoom !== matrix.zoom) {
        this.zoom = matrix.zoom;
        this.changeZoom();
        this.getVisibleRows();

        this.calcItemSize();
      }

      let setNewPlaceId = false;
      let setNewLanguage = false;
      if (!get(this, 'placeId', false)
        && get(matrix, 'place', false)) {
        this.placeId = matrix.place;
        setNewPlaceId = true;
      }

      if (get(this, 'currentLanguage', '') !== language.lang) {
        this.currentLanguage = language.lang;
        setNewLanguage = true;
      }

      if (setNewPlaceId || setNewLanguage) {
        this.getImages();
      }

    })

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
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
            // this.goToRow(row);
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

    this.viewChildren
      .changes
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.calcItemSize();
      })
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

    if (this.combineSubscription) {
      this.combineSubscription.unsubscribe();
    }

    this.loaderService.setLoader(false);
  }

  public changeZoom(): void {
    this.familyImageContainerElement.classList.remove('column-2', 'column-3', 'column-4', 'column-5', 'column-6', 'column-7', 'column-8', 'column-9', 'column-10');
    this.familyImageContainerElement.classList.add('column-' + this.zoom);

    this.showImageBlock = false;
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
    // this.goToRow(row);
    if (!this.prevImage) {
      this.prevImage = image;
      this.showImageBlock = true;
      this.urlParametersService.setActiveImage(index);


      return;
    }

    if (isEqual(this.prevImage, image)) {
      this.showImageBlock = !this.showImageBlock;
      if (!this.showImageBlock) {
        this.prevImage = void 0;
        this.urlParametersService.removeActiveImage();
      }

    } else {
      this.prevImage = image;
      this.showImageBlock = true;
      this.urlParametersService.setActiveImage(index);
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

  // public goToRow(row: number): void {
  //   this.calcItemSize();
  //   const header: HTMLElement = document.querySelector('.header-container') as HTMLElement;
  //
  //   const homeDescription = this.familyComponent.familyHeaderComponent.homeDescriptionContainer.nativeElement;
  //   const shortFamilyInfo = this.familyComponent.familyHeaderComponent.shortFamilyInfoContainer.nativeElement;
  //
  //   const headerHeight: number = homeDescription.offsetHeight - header.offsetHeight - shortFamilyInfo.offsetHeight;
  //
  //   const scrollTop: number = row * this.itemSize + headerHeight;
  //
  //   setTimeout(() => {
  //     document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
  //   }, 0);
  // }

  public calcItemSize(): void {
    if (!this.familyThingsContainerElement || !this.familyImageContainerElement) {
      return;
    }

    const imageContainer: HTMLElement = this.familyImageContainerElement.querySelector('.family-image-container') as HTMLElement;
    if (imageContainer) {
    this.itemSize = imageContainer.offsetHeight;
    this.pagePositionService.itemSize = this.itemSize;
    this.checkCurrentRow();
    }
  }

  public getVisibleRows(): void {
    const imageHeight = this.familyThingsContainerElement.offsetWidth / this.zoom;
    let visibleRows = Math.round(window.innerHeight / imageHeight);

    const indexActiveImage = Number(get(this.urlParametersService, 'parameters.activeImage' , undefined));
    if (indexActiveImage && ((indexActiveImage % this.zoom) > visibleRows ) ) {
      visibleRows = indexActiveImage % this.zoom + 1;
    }

    this.visibleImages = this.zoom * visibleRows;
  }

  getImages(): void {
    const query = `placeId=${this.placeId}&resolution=${this.imageResolution.image}&lang=${this.currentLanguage}`;
    this.familyPlaceServiceSubscribe = this.familyMediaService
      .getFamilyMedia(query)
      .subscribe((res: any) => {
        if (!res.success) {
          this.router.navigate(['./matrix']);
          this.urlParametersService.dispatchToStore(DefaultUrlParameters);

          return;
        }

        this.images = res.data.images;
        this.imageData.photographer = res.data.photographer;

        this.getVisibleRows();

        this.calcItemSize();

        let numberSplice: number = this.visibleImages * 2;

        // if (this.activeImageIndex && this.activeImageIndex > this.visibleImages) {
        //   const positionInRow: number = this.activeImageIndex % this.zoom;
        //   const offset: number = this.zoom - positionInRow;
        //
        //   numberSplice = this.activeImageIndex + offset + this.visibleImages;
        // }
        this.currentImages = slice(this.images, 0, numberSplice);

        this.changeZoom();

        this.loaderService.setLoader(true);
        if (get(this.urlParametersService, 'activeImageByRoute', null)) {
          const activeImage = Number(this.urlParametersService.activeImageByRoute);
          this.activeImage = activeImage;

          this.openMedia(this.images[activeImage], activeImage);
          this.urlParametersService.activeImageByRoute = null;
        }

        if (this.activeImageIndex) {
          // TODO: remove setTimeout on refactoring this component
          setTimeout(() => {
            this.loaderService.setLoader(true);

            this.openMedia(this.images[this.activeImageIndex - 1], this.activeImageIndex - 1);
          });
        }
      });
  }

  checkCurrentRow() {
    this.pagePositionService.setCurrentRow();
  }
}
