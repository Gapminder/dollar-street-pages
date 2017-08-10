import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { environment } from '../../environments/environment';
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
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import { Router } from '@angular/router';
import { ImageResolutionInterface } from '../../interfaces';
import {
  MathService,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  UtilsService
} from '../../common';
import { MatrixViewBlockService } from './matrix-view-block.service';

@Component({
  selector: 'matrix-view-block',
  templateUrl: './matrix-view-block.component.html',
  styleUrls: ['./matrix-view-block.component.css', './matrix-view-block.component.mobile.css']
})
export class MatrixViewBlockComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('viewImageBlockContainer')
  public viewImageBlockContainer: ElementRef;
  @ViewChild('mobileViewImageBlockContainer')
  public mobileViewImageBlockContainer: ElementRef;

  @Input()
  public positionInRow: any;
  @Input()
  public query: any;
  @Input()
  public place: any;
  @Input()
  public thing: string;
  @Input()
  public itemSize: number;

  @Output()
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public goToMatrixWithCountry: EventEmitter<any> = new EventEmitter<any>();

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
  public widthScroll: number;
  public element: HTMLElement;
  public boxContainer: HTMLElement;
  public windowInnerWidth: number = window.innerWidth;
  public isShowCountryButton: boolean;
  public countryName: string;
  public streetData: DrawDividersInterface;
  public utilsService: UtilsService;
  public languageService: LanguageService;
  public showTranslateMe: boolean;
  public imageResolution: ImageResolutionInterface;
  public device: BrowserDetectionService;
  public isDesktop: boolean;
  public currentLanguage: string;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public viewImage: string;
  public streetSettingsStateSubscription: Subscription;
  public consumerApi: string;

  public constructor(zone: NgZone,
                     router: Router,
                     math: MathService,
                     element: ElementRef,
                     familyInfoService: MatrixViewBlockService,
                     browserDetectionService: BrowserDetectionService,
                     languageService: LanguageService,
                     utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private changeDetectorRef: ChangeDetectorRef) {
    this.math = math;
    this.zone = zone;
    this.router = router;
    this.element = element.nativeElement;
    this.device = browserDetectionService;
    this.familyInfoService = familyInfoService;
    this.languageService = languageService;
    this.utilsService = utilsService;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.device.isDesktop();

    this.currentLanguage = this.languageService.currentLanguage;

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
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
          this.setMarkerPosition();

          if (this.familyData && this.familyData.familyData.length) {
            this.familyData.description = this.getDescription(this.familyData.familyData);
          }
        });
      });
  }

  // tslint:disable-next-line
  public ngOnChanges(changes: SimpleChanges): void {
    this.loader = true;
    this.showblock = true;

    this.place.background = this.place.background.replace(this.imageResolution.image, this.imageResolution.expand);
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

    this.viewImage = this.place.background;

    setTimeout(() => this.setMarkerPosition(), 0);

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    let url: string = `placeId=${this.place._id}&thingId=${this.thing}${this.languageService.getLanguageParam()}`;

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

        let query = this.query.replace(/row\=\d*/, 'row=1').replace(/&activeHouse\=\d*/, '');

        let parsedUrl: any = this.utilsService.parseUrl(`place=${this.place._id}&` + query);

        this.familyData.goToPlaceData = parsedUrl;
        this.isShowCountryButton = parsedUrl.countries !== this.familyData.country.originName;
        this.privateZoom = parsedUrl.zoom;

        /*let newImage = new Image();

        newImage.onload = () => {
          this.zone.run(() => {
            this.loader = true;
          });
        };

        newImage.src = this.place.background;*/
      });
  }

  public ngOnDestroy(): void {
    this.resizeSubscribe.unsubscribe();

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
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
    let query: any = this.utilsService.parseUrl(this.query);

    query.regions = 'World';
    query.countries = country;
    query.lowIncome = this.streetData.poor;
    query.highIncome = this.streetData.rich;

    delete query.activeHouse;

    this.goToMatrixWithCountry.emit({url: this.utilsService.objToQuery(query), isCountriesFilter: true});
  }

  public setMarkerPosition(): void {
    this.markerPositionLeft = (this.itemSize * this.positionInRow) - this.itemSize / 2;
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
