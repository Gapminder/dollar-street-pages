import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { environment } from '../../../environments/environment';
import {
  Component,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  NgZone,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  SimpleChanges, AfterViewChecked
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  StreetSettingsState,
  DrawDividersInterface,
  UrlParameters
} from '../../../interfaces';
import {
  BrowserDetectionService,
  LanguageService, UrlChangeService,
  UtilsService
} from '../../../common';
import { FamilyMediaViewBlockService } from './family-media-view-block.service';
import { ImageResolutionInterface } from '../../../interfaces';
import { get } from 'lodash';
import { UrlParametersService } from '../../../url-parameters/url-parameters.service';
import { DEBOUNCE_TIME, FAMILY_HEADER_PADDING } from '../../../defaultState';
import { StreetDrawService } from '../../../shared/street/street.service';
import { PagePositionService } from '../../../shared/page-position/page-position.service';
import { ImageLoadedService } from '../../../shared/image-loaded/image-loaded.service';

interface ImageViewBlockPosition {
  point: { left: number };
}

@Component({
  selector: 'family-media-view-block',
  templateUrl: './family-media-view-block.component.html',
  styleUrls: ['./family-media-view-block.component.css', './family-media-view-block.component.mobile.css']
})
export class FamilyMediaViewBlockComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked{
  @ViewChild('homeDescriptionContainer')
  homeDescriptionContainer: ElementRef;

  @ViewChild('imageBlockContainer')
  imageBlockContainer: ElementRef;

  @Input()
  imageData: any;

  @Output()
  closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  loader: boolean = false;
  imageLoader = false;
  popIsOpen: boolean = false;
  fancyBoxImage: string;
  country: any;
  countryName: string;
  article: any;
  streetData: DrawDividersInterface;
  viewBlockServiceSubscribe: Subscription;
  resizeSubscribe: Subscription;
  imageResolution: ImageResolutionInterface;
  windowInnerWidth: number = window.innerWidth;
  isDesktop: boolean;
  thing: any = {};
  showTranslateMe: boolean;
  element: HTMLElement;
  streetSettingsState: Observable<StreetSettingsState>;
  viewImage: string = '';
  streetSettingsStateSubscription: Subscription;
  consumerApi: string;
  showInCountry: any;
  showInRegion: any;
  showInTheWorld: any;
  needNavigateToBlock = false;
  private imageViewBlockPosition: ImageViewBlockPosition = {
    point: {
      left: 0
    }
  };

  constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private browserDetectionService: BrowserDetectionService,
                     private viewBlockService: FamilyMediaViewBlockService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private urlParametersService: UrlParametersService,
                     private urlChangeService: UrlChangeService,
                     streetService: StreetDrawService,
                     private pagePositionService: PagePositionService,
                     private imagesService: ImageLoadedService) {
    this.element = elementRef.nativeElement;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  uploadImages(url: string): void {
    this.imagesService.imageLoaded(url).then(() => {
      this.zone.run(() => {
        this.imageLoader = true;
      })
    });
  }

  ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (get(data, 'streetSettings', false)) {
        this.streetData = data.streetSettings;
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }

          this.setPointPositionMediaBlock();
        });
      });

    this.setPointPositionMediaBlock();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (get(changes, 'imageData', false)) {
      this.setPointPositionMediaBlock();
      this.country = void 0;
      this.loader = false;
      this.imageLoader = false;


      if (this.viewBlockServiceSubscribe && this.viewBlockServiceSubscribe.unsubscribe) {
        this.viewBlockServiceSubscribe.unsubscribe();
      }

      const query: string = `placeId=${this.imageData.placeId}&thingId=${this.imageData.thing._id}${this.languageService.getLanguageParam()}`;
      this.viewBlockServiceSubscribe = this.viewBlockService.getData(query).subscribe((res: any) => {
          if (res.err) {
            return;
          }

          this.country = res.data.country;
          this.article = res.data.article;
          this.thing = res.data.thing;
          this.showInCountry = {
            thing: this.thing.originPlural,
            countries: [this.country.originName],
            regions: ['World'],
            lowIncome: this.streetData.poor.toString(),
            highIncome: this.streetData.rich.toString(),
          };

          this.showInRegion = {
            thing: this.thing.originPlural,
            countries: this.country.countriesName,
            regions: [this.country.originRegionName],
            lowIncome: this.streetData.poor.toString(),
            highIncome: this.streetData.rich.toString(),
          };

          this.showInTheWorld = {
            thing: this.thing.originPlural,
            countries: ['World'],
            regions: ['World'],
            lowIncome: this.streetData.poor.toString(),
            highIncome: this.streetData.rich.toString(),
          };

          this.truncCountryName(this.country);

          if (this.article && !this.article.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
            this.showTranslateMe = true;
          }

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }

          this.loader = true;

          this.uploadImages(this.imageData.image);

          this.viewImage = this.imageData.image;

          this.needNavigateToBlock = true;


      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.needNavigateToBlock) {
      this.scrollToBlock();

      // TODO: need create separate the Family service which will upload and manage all Family data, for don't want to  expect to will be uploaded some data other components;
      setTimeout(() => {
        this.scrollToBlock();
      }, 1500)
      this.needNavigateToBlock = false;
    }
  }

  scrollToBlock(): void {
    const rect = this.imageBlockContainer.nativeElement.getBoundingClientRect();
    const elementHeightTop = window.scrollY  + rect.top;
    const scrollTo = elementHeightTop - FAMILY_HEADER_PADDING;
    window.scrollTo(0, scrollTo);
  }

  private setPointPositionMediaBlock() {
    const POINT_WIDTH = 32;
    const thingContainer = document.querySelector('.family-things-container');
    if (thingContainer) {
      const gridElement: HTMLElement = (thingContainer.querySelector('.family-image-container') as HTMLElement);
      const elemWidth = gridElement.offsetWidth;
      this.imageViewBlockPosition.point.left = (elemWidth * (this.imageData.index - 1)) + elemWidth / 2 - POINT_WIDTH / 2;
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.viewBlockServiceSubscribe) {
      this.viewBlockServiceSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
  }

  openPopUp(): void {
    this.popIsOpen = true;

    const imgUrl = this.consumerApi + '/v1/download-image/' + this.imageData.imageId;
    const newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = `url("${imgUrl}")`;
      });
    };
    newImage.src = imgUrl;
  }

  fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  closeImageBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  truncCountryName(countryData: any): any {
    switch (countryData.name) {
      case 'South Africa' :
        this.countryName = 'SA';
        break;
      case 'United States' :
        this.countryName = 'USA';
        break;
      case 'United Kingdom' :
        this.countryName = 'UK';
        break;
      default :
        this.countryName = countryData.name;
    }
  }

  getDescription(shortDescription: string): string {
    let numbers: number = 600;

    if (this.isDesktop) {
      if (this.windowInnerWidth > 1400 && shortDescription.length > 600) {
        numbers = 600;
      } else if (this.windowInnerWidth > 1280 && this.windowInnerWidth <= 1400 && shortDescription.length > 600) {
        numbers = 350;
      } else if (this.windowInnerWidth <= 1280) {
        numbers = 200;
      }
    }

    if (shortDescription.length > numbers) {
      return shortDescription.slice(0, numbers) + '...';
    } else {
      return shortDescription;
    }
  }

  goToPage(url: string, params: UrlParameters): void {
    this.urlParametersService.dispatchToStore(params);
  }

  goToMatrixWithParams(params: UrlParameters) {
    this.urlParametersService.dispatchToStore(params);
    this.pagePositionService.scrollTopZero();
  }
}
