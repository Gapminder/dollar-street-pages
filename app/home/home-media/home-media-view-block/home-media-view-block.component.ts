import { Component, Input, Inject, Output, OnChanges, OnDestroy, NgZone, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs';

import { Config, ImageResolutionInterface } from '../../../app.config';

let device = require('device.js')();
let isDesktop = device.desktop();

let tplMobile = require('./mobile/home-media-view-block-mobile.template.html');
let styleMobile = require('./mobile/home-media-view-block-mobile.css');

let tpl = require('./home-media-view-block.template.html');
let style = require('./home-media-view-block.css');

@Component({
  selector: 'home-media-view-block',
  template: isDesktop ? tpl : tplMobile,
  styles: [isDesktop ? style : styleMobile],
  directives: [ROUTER_DIRECTIVES]
})

export class HomeMediaViewBlockComponent implements OnChanges, OnDestroy {
  protected loader: boolean = false;
  protected popIsOpen: boolean = false;
  protected fancyBoxImage: string;
  protected country: any;
  protected article: any;
  protected api: string = Config.api;
  @Input('imageData')
  private imageData: any;

  @Output('closeBigImageBlock')
  private closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  private zone: NgZone;
  private viewBlockService: any;
  private viewBlockServiceSubscribe: Subscription;
  private imageResolution: ImageResolutionInterface = Config.getImageResolution();

  public constructor(@Inject(NgZone) zone: NgZone,
                     @Inject('HomeMediaViewBlockService') viewBlockService: any) {
    this.zone = zone;
    this.viewBlockService = viewBlockService;
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

          if (this.article && this.article.shortDescription.length > 600) {
            this.article.shortDescription = this.article.shortDescription.slice(0, 600) + '...';
          }

          if (isImageLoaded) {
            this.loader = true;
          }
        });
    }
  }

  public ngOnDestroy(): void {
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
}
