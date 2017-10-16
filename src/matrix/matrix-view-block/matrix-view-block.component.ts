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
import * as AppActions from '../../app/ngrx/app.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../../shared/things-filter/ngrx/things-filter.actions';
import * as CountriesFilterActions from '../../shared/countries-filter/ngrx/countries-filter.actions';
import { Router } from '@angular/router';
import { ImageResolutionInterface } from '../../interfaces';
import {
  MathService,
  DrawDividersInterface,
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService
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
  public place: any;
  @Input()
  public thing: string;
  @Input()
  public itemSize: number;

  @Output()
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public goToMatrixWithCountry: EventEmitter<any> = new EventEmitter<any>();

  public query: any;
  public familyInfoServiceSubscribe: Subscription;
  public fancyBoxImage: any;
  public showblock: boolean;
  public familyData: any = {};
  public loader: boolean = false;
  public markerPositionLeft: number;
  public privateZoom: any;
  public resizeSubscribe: Subscription;
  public popIsOpen: boolean;
  public mapData: any;
  public widthScroll: number;
  public element: HTMLElement;
  public boxContainer: HTMLElement;
  public windowInnerWidth: number = window.innerWidth;
  public isShowCountryButton: boolean;
  public countryName: string;
  public streetData: DrawDividersInterface;
  public showTranslateMe: boolean;
  public imageResolution: ImageResolutionInterface;
  public isDesktop: boolean;
  public currentLanguage: string;
  public streetSettingsState: Observable<DrawDividersInterface>;
  public viewImage: string;
  public streetSettingsStateSubscription: Subscription;
  public consumerApi: string;
  public appState: Observable<any>;
  public appStateSubscription: Subscription;
  public matrixState: Observable<any>;
  public matrixStateSubscription: Subscription;
  public currencyUnit: any;
  public timeUnit: any;
  public timeUnits: any[];

  public constructor(elementRef: ElementRef,
                     private zone: NgZone,
                     private router: Router,
                     private math: MathService,
                     private familyInfoService: MatrixViewBlockService,
                     private browserDetectionService: BrowserDetectionService,
                     private languageService: LanguageService,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>,
                     private changeDetectorRef: ChangeDetectorRef,
                     private urlChangeService: UrlChangeService) {
    this.element = elementRef.nativeElement;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.currentLanguage = this.languageService.currentLanguage;

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
    this.appState = this.store.select((appStates: AppStates) => appStates.app);
    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: any) => {
      if (data) {
        if (data.streetSettings) {
          this.streetData = data.streetSettings;
        }
      }
    });

    this.appStateSubscription = this.appState.subscribe((data: any) => {
      if (data) {
        if (this.query !== data.query) {
          this.query = data.query;
        }
      }
    });

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
          }
        }

        if (data.timeUnit) {
          if (this.timeUnit !== data.timeUnit) {
            this.timeUnit = data.timeUnit;
          }
        }

        if (data.timeUnits) {
          if (data.timeUnits) {
            if (this.timeUnits !== data.timeUnits) {
                this.timeUnits = data.timeUnits;
                this.changeTimeUnit(this.timeUnit.code);
            }
          }
        }
      }
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

  public changeTimeUnit(code: string): void {
    this.timeUnit = this.timeUnits.find(unit => unit.code === code);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.initViewBlock();
  }

  // tslint:disable-next-line
  public initViewBlock(): void {
    if (!this.place.background) {
      return;
    }

    this.loader = true;
    this.showblock = true;

    this.place.background = this.place.background.replace(this.imageResolution.image, this.imageResolution.expand);
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

    this.viewImage = this.place.background;

    setTimeout(() => this.setMarkerPosition(), 0);

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    let query: string = `placeId=${this.place._id}&thingId=${this.thing}${this.languageService.getLanguageParam()}`;
    this.familyInfoServiceSubscribe = this.familyInfoService.getFamilyInfo(query).subscribe((res: any) => {
      if (res.err) {
        console.error(res.err);
        return;
      }

      this.familyData = res.data;

      if (!this.familyData.translated && this.languageService.currentLanguage !== this.languageService.defaultLanguage) {
        this.showTranslateMe = true;
      } else {
        this.showTranslateMe = false;
      }

      if (this.familyData && this.familyData.familyData && this.familyData.familyData.length) {
        this.familyData.description = this.getDescription(this.familyData.familyData);
      }

      this.countryName = this.truncCountryName(this.familyData.country);

      let parsedUrl: any = this.utilsService.parseUrl(`place=${this.place._id}`);

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
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }

    if (this.familyInfoServiceSubscribe) {
      this.familyInfoServiceSubscribe.unsubscribe();
    }

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
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

  public visitThisHome(): void {
    let queryUrl: any = this.utilsService.parseUrl(this.query);

    queryUrl.place = this.familyData.goToPlaceData.place;

    //let query = this.utilsService.objToQuery(queryUrl);
    //this.store.dispatch(new AppActions.SetQuery(query));

    this.router.navigate(['/family'], {queryParams: queryUrl});
  }

  public goToMatrixByCountry(country: string): void {
    let queryParams: any = this.utilsService.parseUrl(this.query);

    queryParams.regions = 'World';
    queryParams.countries = country;
    queryParams.lowIncome = this.streetData.poor;
    queryParams.highIncome = this.streetData.rich;

    delete queryParams.activeHouse;

    let queryUrl: string = this.utilsService.objToQuery(queryParams);

    this.store.dispatch(new AppActions.SetQuery(queryUrl));

    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(queryUrl));

    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.SetSelectedCountries(queryParams.countries));
    this.store.dispatch(new CountriesFilterActions.SetSelectedRegions(queryParams.regions));

    this.store.dispatch(new MatrixActions.UpdateMatrix(true));

    this.urlChangeService.replaceState('/matrix', queryUrl);

    this.scrollTopZero();

    // this.goToMatrixWithCountry.emit({url: this.utilsService.objToQuery(query), isCountriesFilter: true});
  }

  public scrollTopZero(): void {
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
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
