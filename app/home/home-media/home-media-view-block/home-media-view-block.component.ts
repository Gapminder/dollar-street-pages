import { Component, Input, Output, OnChanges, OnDestroy, NgZone, EventEmitter, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Config, ImageResolutionInterface } from '../../../app.config';
import { HomeMediaViewBlockService } from './home-media-view-block.service';

let device = require('device.js')();
let isDesktop = device.desktop();

let tplMobile = require('./mobile/home-media-view-block-mobile.template.html');
let styleMobile = require('./mobile/home-media-view-block-mobile.css');

let tpl = require('./home-media-view-block.template.html');
let style = require('./home-media-view-block.css');

@Component({
  selector: 'home-media-view-block',
  template: isDesktop ? tpl : tplMobile,
  styles: [isDesktop ? style : styleMobile]
})

export class HomeMediaViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  protected api: string = Config.api;
  private loader: boolean = false;
  private popIsOpen: boolean = false;
  private fancyBoxImage: string;
  private country: any;
  private countryName: any;
  private article: any;
  @Input('imageData')
  private imageData: any;

  @Output('closeBigImageBlock')
  private closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  private zone: NgZone;
  private viewBlockService: HomeMediaViewBlockService;
  private viewBlockServiceSubscribe: Subscription;
  private resizeSubscribe: Subscription;
  private imageResolution: ImageResolutionInterface = Config.getImageResolution();
  private windowInnerWidth: number = window.innerWidth;

  public constructor(zone: NgZone,
                     viewBlockService: HomeMediaViewBlockService) {
    this.zone = zone;
    this.viewBlockService = viewBlockService;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
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
        .getData(`placeId=${this.imageData.placeId}&thingId=${this.imageData.thing._id}`)
        .subscribe((res: any) => {
          if (res.err) {
            console.error(res.err);
            return;
          }

          this.country = res.data.country;
          this.article = res.data.article;

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
    this.resizeSubscribe.unsubscribe();
    this.viewBlockServiceSubscribe.unsubscribe();
  }

  protected openPopUp(): void {
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

  protected fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  protected closeImageBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  private truncCountryName(countryData: any): any {
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

  private getDescription(shortDescription: string): string {
    let numbers: number = 600;

    if (isDesktop) {
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
