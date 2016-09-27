import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  Inject,
  EventEmitter,
  NgZone,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { RegionMapComponent } from '../../common/region-map/region-map.component';
import { Config, ImageResolutionInterface } from '../../../app/app.config';

let device = require('device.js')();
let isDesktop = device.desktop();

let tplMobile = require('./mobile/matrix-view-block-mobile.template.html');
let styleMobile = require('./mobile/matrix-view-block-mobile.css');

let tpl = require('./matrix-view-block.template.html');
let style = require('./matrix-view-block.css');

@Component({
  selector: 'matrix-view-block',
  template: isDesktop ? tpl : tplMobile,
  styles: [isDesktop ? style : styleMobile],
  directives: [RegionMapComponent, ROUTER_DIRECTIVES]
})

export class MatrixViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  public familyInfoServiceSubscribe: Subscription;
  public fancyBoxImage: any;

  protected showblock: boolean;
  protected familyData: any = {};
  protected loader: boolean = false;
  protected math: any;
  protected markerPositionLeft: number;
  protected api: string = Config.api;

  private privateZoom: any;
  private resizeSubscribe: Subscription;
  private popIsOpen: boolean;
  private mapData: any;
  private familyInfoService: any;
  private zone: NgZone;
  private router: Router;
  private boxContainerPadding: number;
  private widthScroll: number;
  private element: HTMLElement;
  private boxContainer: HTMLElement;
  private windowInnerWidth: number = window.innerWidth;
  private isShowCountryButton: boolean;
  private countryName: string;

  @Input('positionInRow')
  private positionInRow: any;
  @Input('query')
  private query: any;
  @Input('place')
  private place: any;
  @Input('thing')
  private thing: string;
  @Output('closeBigImageBlock')
  private closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output('goToMatrixWithCountry')
  private goToMatrixWithCountry: EventEmitter<any> = new EventEmitter<any>();
  private imageResolution: ImageResolutionInterface = Config.getImageResolution();

  public constructor(zone: NgZone,
                     router: Router,
                     element: ElementRef,
                     @Inject('Math') math: any,
                     @Inject('FamilyInfoService') familyInfoService: any) {
    this.math = math;
    this.zone = zone;
    this.router = router;
    this.element = element.nativeElement;
    this.familyInfoService = familyInfoService;
  }

  public ngOnInit(): void {
    this.resizeSubscribe = Observable
      .fromEvent(window, 'resize')
      .debounceTime(150)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;
          this.setMarkerPosition();

          if (this.familyData && this.familyData.familyData.length) {
            this.familyData.description = this.getDescription(this.familyData.familyData);
          }
        });
      });
  }

  public ngOnChanges(): void {
    this.loader = false;
    this.showblock = true;

    let url = `placeId=${this.place._id}&thingId=${this.thing}`;
    let parseUrl: any = this.parseUrl(`place=${this.place._id}&` + this.query.replace(/&activeHouse\=\d*/, ''));
    this.privateZoom = parseUrl.zoom;

    setTimeout(() => this.setMarkerPosition(), 0);

    this.place.background = this.place.background.replace(this.imageResolution.image, this.imageResolution.expand);
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    this.familyInfoServiceSubscribe = this.familyInfoService.getFamilyInfo(url)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.familyData = res.data;

        if (this.familyData && this.familyData.familyData.length) {
          this.familyData.description = this.getDescription(this.familyData.familyData);
        }
        this.countryName = this.truncCountryName(this.familyData.country);
        this.familyData.goToPlaceData = parseUrl;
        this.isShowCountryButton = parseUrl.countries !== this.familyData.country.alias;
        this.loader = true;
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }
  }

  protected closeBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  protected openPopUp(): void {
    this.popIsOpen = true;

    let imgUrl = this.place.background.replace(this.imageResolution.expand, this.imageResolution.full);
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

  protected goToMatrixByCountry(country: string): void {
    let query: any = this.parseUrl(this.query);

    query.regions = 'World';
    query.countries = country;
    query.lowIncome = '1';
    query.highIncome = '15000';

    delete query.activeHouse;

    this.goToMatrixWithCountry.emit({url: this.objToQuery(query), isCountriesFilter: true});
  }

  private parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  private setMarkerPosition(): void {
    this.widthScroll = window.innerWidth - document.body.offsetWidth;

    this.boxContainer = this.element.querySelector('.view-image-block-container') as HTMLElement;
    let paddingLeft: string = window.getComputedStyle(this.boxContainer).getPropertyValue('padding-left');
    this.boxContainerPadding = parseFloat(paddingLeft);

    let imageWidth: number = (this.boxContainer.offsetWidth - this.boxContainerPadding * 2 - this.widthScroll) / this.privateZoom;

    this.markerPositionLeft = imageWidth * (this.positionInRow || this.privateZoom) - (imageWidth / 2 + 16);
  }

  private getDescription(shortDescription: string): string {
    let numbers: number = 300;

    if (isDesktop) {
      if (this.windowInnerWidth > 1440 && shortDescription.length > 300) {
        numbers = 300;
      } else if (this.windowInnerWidth <= 1440 && shortDescription.length > 113) {
        numbers = 113;
      }
    }

    if (shortDescription.length > numbers) {
      return shortDescription.slice(0, numbers) + '...';
    } else {
      return shortDescription;
    }
  }

  private objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  private truncCountryName(countryData: any): string {
    let countryName: string;

    switch (countryData.alias) {
      case 'South Africa' :
        countryName = 'SA';
        break;
      case 'United States' :
        countryName = 'USA';
        break;
      case 'United Kingdom' :
        countryName = 'UK';
        break;
      default :
        countryName = countryData.alias;
    }

    return countryName;
  }
}
