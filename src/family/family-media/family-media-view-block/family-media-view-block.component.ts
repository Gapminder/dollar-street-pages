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
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../interfaces';
import {
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  UtilsService
} from '../../../common';
import { FamilyMediaViewBlockService } from './family-media-view-block.service';
import { ImageResolutionInterface } from '../../../interfaces';

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
  public zone: NgZone;
  public viewBlockService: FamilyMediaViewBlockService;
  public viewBlockServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public imageResolution: ImageResolutionInterface;
  public windowInnerWidth: number = window.innerWidth;
  public device: BrowserDetectionService;
  public utilsService: UtilsService;
  public isDesktop: boolean;
  public thing: any = {};
  public languageService: LanguageService;
  public showTranslateMe: boolean;
  public element: HTMLElement;
  public store: Store<AppStore>;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public viewImage: string;
  public streetSettingsStateSubscription: Subscription;
  public consumerApi: string;
  public showInCountry: any;
  public showInRegion: any;
  public showInTheWorld: any;

  public constructor(zone: NgZone,
                     browserDetectionService: BrowserDetectionService,
                     viewBlockService: FamilyMediaViewBlockService,
                     languageService: LanguageService,
                     utilsService: UtilsService,
                     elementRef: ElementRef,
                     store: Store<AppStore>) {
    this.zone = zone;
    this.viewBlockService = viewBlockService;
    this.device = browserDetectionService;
    this.languageService = languageService;
    this.utilsService = utilsService;
    this.element = elementRef.nativeElement;
    this.store = store;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.device.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((dataSet: AppStore) => dataSet.streetSettings);
  }

  public ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: DrawDividersInterface) => {
      this.streetData = data;
    });

    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }
        });
      });
  }

  public ngOnChanges(changes: any): void {
    if (changes.imageData) {
      this.country = void 0;
      this.loader = true;

      /*let isImageLoaded: boolean = false;
      let image: any = new Image();

      image.onload = () => {
        this.zone.run(() => {
          isImageLoaded = true;

          if (this.country) {
            this.loader = true;
          }
        });
      };

      image.src = this.imageData.image;*/

      this.viewImage = this.imageData.image;

      if (this.viewBlockServiceSubscribe && this.viewBlockServiceSubscribe.unsubscribe) {
        this.viewBlockServiceSubscribe.unsubscribe();
      }

      let query: string = `placeId=${this.imageData.placeId}&thingId=${this.imageData.thing._id}${this.languageService.getLanguageParam()}`;

      this.viewBlockServiceSubscribe = this.viewBlockService
        .getData(query)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
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

          /*if (isImageLoaded) {
            this.loader = true;
          }*/
        });
    }
  }

  public ngOnDestroy(): void {
    if(this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if(this.viewBlockServiceSubscribe) {
      this.viewBlockServiceSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
  }

  public openPopUp(): void {
    this.popIsOpen = true;

    let imgUrl = this.imageData.image.replace(this.imageResolution.expand, this.imageResolution.full);
    let newImage = new Image();

    newImage.onload = () => {
      this.zone.run(() => {
        this.fancyBoxImage = 'url("' + imgUrl + '")';
      });
    };

    newImage.src = imgUrl;
  };

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
