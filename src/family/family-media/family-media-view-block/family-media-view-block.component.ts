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
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  StreetSettingsState,
  DrawDividersInterface
} from '../../../interfaces';
import {
  BrowserDetectionService,
  LanguageService,
  UtilsService
} from '../../../common';
import { FamilyMediaViewBlockService } from './family-media-view-block.service';
import { ImageResolutionInterface } from '../../../interfaces';
import { get } from 'lodash';

interface ImageViewBlockPosition {
  point: { left: number };
}

@Component({
  selector: 'family-media-view-block',
  templateUrl: './family-media-view-block.component.html',
  styleUrls: ['./family-media-view-block.component.css', './family-media-view-block.component.mobile.css']
})
export class FamilyMediaViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('homeDescriptionContainer')
  public homeDescriptionContainer: ElementRef;

  @Input()
  public imageData: any;

  @Output()
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  public loader: boolean = false;
  public popIsOpen: boolean = false;
  public fancyBoxImage: string;
  public country: any;
  public countryName: string;
  public article: any;
  public streetData: DrawDividersInterface;
  public viewBlockServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public imageResolution: ImageResolutionInterface;
  public windowInnerWidth: number = window.innerWidth;
  public isDesktop: boolean;
  public thing: any = {};
  public showTranslateMe: boolean;
  public element: HTMLElement;
  public streetSettingsState: Observable<StreetSettingsState>;
  public viewImage: string;
  public streetSettingsStateSubscription: Subscription;
  public consumerApi: string;
  public showInCountry: any;
  public showInRegion: any;
  public showInTheWorld: any;
  private imageViewBlockPosition: ImageViewBlockPosition = {
    point: {
      left: 0
    }
  };

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private browserDetectionService: BrowserDetectionService,
                     private viewBlockService: FamilyMediaViewBlockService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>) {
    this.element = elementRef.nativeElement;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  public ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (get(data, 'streetSettings', false)) {
        this.streetData = data.streetSettings;
      }
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }

          this.setPointPositionMediaBlock();
        });
      });

    process.nextTick(() => {
      this.setPointPositionMediaBlock();
    })
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (get(changes, 'imageData', false)) {
      this.setPointPositionMediaBlock();
      this.country = void 0;
      this.loader = true;

      this.viewImage = this.imageData.image;

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
            countries: this.country.originName,
            regions: 'World',
            zoom: '4',
            row: '1',
            lowIncome: this.streetData.poor,
            highIncome: this.streetData.rich,
            lang: this.languageService.currentLanguage
          };

          this.showInRegion = {
            thing: this.thing.originPlural,
            countries: this.country.countriesName.join(','),
            regions: this.country.originRegionName,
            zoom: '4',
            row: '1',
            lowIncome: this.streetData.poor,
            highIncome: this.streetData.rich,
            lang: this.languageService.currentLanguage
          };

          this.showInTheWorld = {
            thing: this.thing.originPlural,
            countries: 'World',
            regions: 'World',
            zoom: '4',
            row: '1',
            lowIncome: this.streetData.poor,
            highIncome: this.streetData.rich,
            lang: this.languageService.currentLanguage
          };

          this.truncCountryName(this.country);

          if (this.article && !this.article.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
            this.showTranslateMe = true;
          }

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }
      });
    }
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

  public ngOnDestroy(): void {
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

  public openPopUp(): void {
    this.popIsOpen = true;

    const imgUrl = this.imageData.image.replace(this.imageResolution.expand, this.imageResolution.full);
    const newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = `url("${imgUrl}")`;
      });
    };
    newImage.src = imgUrl;
  }

  public fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  public closeImageBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  public truncCountryName(countryData: any): any {
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

  public getDescription(shortDescription: string): string {
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
}
