import 'rxjs/operator/debounceTime';
import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  EventEmitter,
  NgZone,
  OnDestroy,
  ElementRef,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { ImageResolutionInterface } from '../../interfaces';

import { MathService,
         StreetSettingsService,
         DrawDividersInterface,
         BrowserDetectionService,
         LanguageService,
         UtilsService } from '../../common';

import { MatrixViewBlockService } from './matrix-view-block.service';

@Component({
  selector: 'matrix-view-block',
  templateUrl: './matrix-view-block.component.html',
  styleUrls: ['./matrix-view-block.component.css', './matrix-view-block.component.mobile.css']
})

export class MatrixViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  @Input('positionInRow')
  public positionInRow: any;
  @Input('query')
  public query: any;
  @Input('place')
  public place: any;
  @Input('thing')
  public thing: string;
  @Output('closeBigImageBlock')
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output('goToMatrixWithCountry')
  public goToMatrixWithCountry: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('viewImageBlockContainer')
  public viewImageBlockContainer: ElementRef;
  @ViewChild('mobileViewImageBlockContainer')
  public mobileViewImageBlockContainer: ElementRef;

  public familyInfoServiceSubscribe: Subscription;
  public fancyBoxImage: any;
  public showblock: boolean;
  public familyData: any = {};
  public loader: boolean = false;
  public markerPositionLeft: number;
  public math: MathService;
  public privateZoom: any;
  public resizeSubscribe: Subscription;
  public popIsOpen: boolean;
  public mapData: any;
  public familyInfoService: MatrixViewBlockService;
  public zone: NgZone;
  public router: Router;
  public boxContainerPadding: number;
  public widthScroll: number;
  public element: HTMLElement;
  public boxContainer: HTMLElement;
  public windowInnerWidth: number = window.innerWidth;
  public isShowCountryButton: boolean;
  public countryName: string;
  public streetData: DrawDividersInterface;
  public streetSettingsService: StreetSettingsService;
  public utilsServece: UtilsService;
  public streetServiceSubscribe: Subscription;
  public languageService: LanguageService;
  public showTranslateMe: boolean;
  public imageResolution: ImageResolutionInterface;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public currentLanguage: string;

  public constructor(zone: NgZone,
                     router: Router,
                     math: MathService,
                     element: ElementRef,
                     familyInfoService: MatrixViewBlockService,
                     browserDetectionService: BrowserDetectionService,
                     streetSettingsService: StreetSettingsService,
                     languageService: LanguageService,
                     utilsService: UtilsService) {
    this.math = math;
    this.zone = zone;
    this.router = router;
    this.element = element.nativeElement;
    this.streetSettingsService = streetSettingsService;
    this.device = browserDetectionService;
    this.familyInfoService = familyInfoService;
    this.languageService = languageService;
    this.utilsServece = utilsService;

    this.isDesktop = this.device.isDesktop();

    this.currentLanguage = this.languageService.currentLanguage;

    this.imageResolution = this.utilsServece.getImageResolution(this.isDesktop);
  }

  public ngOnInit(): void {
    this.resizeSubscribe = fromEvent(window, 'resize')
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

    this.streetServiceSubscribe = this.streetSettingsService.getStreetSettings()
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }
        this.streetData = res.data;
      });
  }

  // tslint:disable-next-line
  public ngOnChanges(changes: SimpleChanges): void {
    this.loader = false;
    this.showblock = true;

    let url = `placeId=${this.place._id}&thingId=${this.thing}${this.languageService.getLanguageParam()}`;
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

        if (!this.familyData.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
          this.showTranslateMe = true;
        }

        if (this.familyData && this.familyData.familyData && this.familyData.familyData.length) {
          this.familyData.description = this.getDescription(this.familyData.familyData);
        }

        this.countryName = this.truncCountryName(this.familyData.country);
        this.familyData.goToPlaceData = parseUrl;
        this.isShowCountryButton = parseUrl.countries !== this.familyData.country.originName;

        let newImage = new Image();

        newImage.onload = () => {
          this.zone.run(() => {
            this.loader = true;
          });
        };

        newImage.src = this.place.background;
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }
  }

  public closeBlock(): void {
    this.closeBigImageBlock.emit({});
  }

  public openPopUp(): void {
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

  public fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  public goToMatrixByCountry(country: string): void {
    let query: any = this.parseUrl(this.query);

    query.regions = 'World';
    query.countries = country;
    query.lowIncome = this.streetData.poor;
    query.highIncome = this.streetData.rich;

    delete query.activeHouse;

    this.goToMatrixWithCountry.emit({url: this.objToQuery(query), isCountriesFilter: true});
  }

  public parseUrl(url: string): any {
    return JSON.parse(`{"${url.replace(/&/g, '\",\"').replace(/=/g, '\":\"')}"}`);
  }

  public setMarkerPosition(): void {
    this.widthScroll = window.innerWidth - document.body.offsetWidth;

    if(!this.viewImageBlockContainer) {
      return;
    }

    let boxContainer: HTMLElement = this.viewImageBlockContainer.nativeElement as HTMLElement;

    if (!boxContainer) {
      boxContainer = this.mobileViewImageBlockContainer.nativeElement as HTMLElement;
    }

    this.boxContainer = boxContainer;
    let paddingLeft: string = window.getComputedStyle(this.boxContainer).getPropertyValue('padding-left');
    this.boxContainerPadding = parseFloat(paddingLeft);

    let imageWidth: number = (this.boxContainer.offsetWidth - this.boxContainerPadding * 2 - this.widthScroll) / this.privateZoom;

    this.markerPositionLeft = imageWidth * (this.positionInRow || this.privateZoom) - (imageWidth / 2 + 16);
  }

  public getDescription(shortDescription: string): string {
    let numbers: number = 300;

    if (this.isDesktop) {
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

  public objToQuery(data: any): string {
    return Object.keys(data).map((k: string) => {
      return encodeURIComponent(k) + '=' + data[k];
    }).join('&');
  }

  public truncCountryName(countryData: any): string {
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
