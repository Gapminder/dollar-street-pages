import 'rxjs/operator/debounceTime';

import { Component, Input, Output, OnChanges, OnDestroy, NgZone, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { Config, ImageResolutionInterface } from '../../../app.config';
import { FamilyMediaViewBlockService } from './family-media-view-block.service';
import { StreetSettingsService, DrawDividersInterface, BrowserDetectionService, LanguageService } from '../../../common';

@Component({
  selector: 'family-media-view-block',
  templateUrl: './family-media-view-block.component.html',
  styleUrls: ['./family-media-view-block.component.css', './family-media-view-block.component.mobile.css']
})

export class FamilyMediaViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  public api: string = Config.api;
  public loader: boolean = false;
  public popIsOpen: boolean = false;
  public fancyBoxImage: string;
  public country: any;
  public countryName: string;
  public article: any;
  @Input('imageData')
  public imageData: any;

  @Output('closeBigImageBlock')
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  public streetData: DrawDividersInterface;
  public zone: NgZone;
  public viewBlockService: FamilyMediaViewBlockService;
  public viewBlockServiceSubscribe: Subscription;
  public resizeSubscribe: Subscription;
  public imageResolution: ImageResolutionInterface;
  public windowInnerWidth: number = window.innerWidth;
  public streetServiceSubscribe: Subscription;
  public streetSettingsService: StreetSettingsService;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public thing: any = {};

  public languageService: LanguageService;

  public constructor(zone: NgZone,
                     streetSettingsService: StreetSettingsService,
                     browserDetectionService: BrowserDetectionService,
                     viewBlockService: FamilyMediaViewBlockService,
                     languageService: LanguageService) {
    this.zone = zone;
    this.viewBlockService = viewBlockService;
    this.device = browserDetectionService;
    this.streetSettingsService = streetSettingsService;
    this.languageService = languageService;
    this.isDesktop = this.device.isDesktop();
    this.imageResolution = Config.getImageResolution(this.isDesktop);
  }

  public ngOnInit(): void {
    this.streetServiceSubscribe = this.streetSettingsService
      .getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.streetData = res.data;
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
      this.loader = false;
      let isImageLoaded: boolean = false;
      let image: any = new Image();

      image.onload = () => {
        this.zone.run(() => {
          isImageLoaded = true;

          if (this.country) {
            this.loader = true;
          }
        });
      };

      image.src = this.imageData.image;

      if (this.viewBlockServiceSubscribe && this.viewBlockServiceSubscribe.unsubscribe) {
        this.viewBlockServiceSubscribe.unsubscribe();
      }

      this.viewBlockServiceSubscribe = this.viewBlockService
        .getData(`placeId=${this.imageData.placeId}&thingId=${this.imageData.thing._id}${this.languageService.getLanguageParam()}`)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.country = res.data.country;
          this.article = res.data.article;
          this.thing = res.data.thing;

          this.truncCountryName(this.country);

          if (this.article && this.article.shortDescription.length) {
            this.article.description = this.getDescription(this.article.shortDescription);
          }

          if (isImageLoaded) {
            this.loader = true;
          }
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

    if(this.streetServiceSubscribe) {
      this.streetServiceSubscribe.unsubscribe();
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
