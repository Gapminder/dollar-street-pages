import 'rxjs/operator/debounceTime';
import { Subscription } from 'rxjs/Rx';
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
import {
  AppStates,
  StreetSettingsState,
  DrawDividersInterface,
  UrlParameters,
  Place,
  TimeUnit,
  MatrixState,
  AppState,
  Currency,
  LanguageState,
  TranslationsInterface
} from '../../interfaces';
import * as AppActions from '../../app/ngrx/app.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../../shared/things-filter/ngrx/things-filter.actions';
import * as CountriesFilterActions from '../../shared/countries-filter/ngrx/countries-filter.actions';
import { Router } from '@angular/router';
import { ImageResolutionInterface } from '../../interfaces';
import {
  MathService,
  BrowserDetectionService,
  LanguageService,
  UtilsService,
  UrlChangeService, IncomeCalcService
} from '../../common';
import { MatrixViewBlockService } from './matrix-view-block.service';
import { StreetDrawService } from '../../shared/street/street.service';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { get, forEach, filter } from 'lodash';
import {
  DEBOUNCE_TIME
} from '../../defaultState';
import { PagePositionService } from '../../shared/page-position/page-position.service';
import { ImageLoadedService } from '../../shared/image-loaded/image-loaded.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

const INIT_STATE_IMAGES = {
  main: false,
  familyImage: false,
  houseImage: false
}

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
  public place: Place;
  @Input()
  public thing: string;
  @Input()
  public itemSize: number;

  @Output()
  public closeBigImageBlock: EventEmitter<any> = new EventEmitter<any>();

  public query: any;
  public fancyBoxImage: any;
  public showblock: boolean;
  public familyData: any = {};
  public loader: boolean = false;
  public markerPositionLeft: number;
  public privateZoom: any;
  public popIsOpen: boolean;
  public mapData: any;
  public element: HTMLElement;
  public windowInnerWidth: number = window.innerWidth;
  public isShowCountryButton: boolean;
  public countryName: string;
  public streetData: DrawDividersInterface;
  public showTranslateMe: boolean;
  public imageResolution: ImageResolutionInterface;
  public isDesktop: boolean;
  public currentLanguage: string;
  public viewImage: string;
  public consumerApi: string;
  public currencyUnit: Currency;
  public timeUnit: TimeUnit;
  public timeUnits: TimeUnit[];
  imagesIsLoaded: {[key: string]: boolean} = INIT_STATE_IMAGES;
  ngSubscriptions: {[key: string]: Subscription} = {};

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
                     private urlChangeService: UrlChangeService,
                     public streetService: StreetDrawService,
                     private urlParametersService : UrlParametersService,
                     private pagePositionService: PagePositionService,
                     private imageService: ImageLoadedService,
                     private incomeCalcService: IncomeCalcService) {
    this.element = elementRef.nativeElement;
    this.consumerApi = environment.consumerApi;

    this.isDesktop = this.browserDetectionService.isDesktop();

    this.imageResolution = this.utilsService.getImageResolution(this.isDesktop);


  }

  public ngOnInit(): void {
    const languageState = this.store
      .select((appStates: AppStates) => appStates.language);

    const matrixState = this.store
      .select((appStates: AppStates) => appStates.matrix);

    this.ngSubscriptions.streetSettings = this.store
      .select((appStates: AppStates) => appStates.streetSettings)
      .subscribe((data: StreetSettingsState) => {
        if (get(data, 'streetSettings', false)) {
          this.streetData = data.streetSettings;
        }
    });


    this.ngSubscriptions.appState = this.store
      .select((appStates: AppStates) => appStates.app)
      .subscribe((data: AppState) => {
        if (data) {
          if (this.query !== data.query) {
            this.query = data.query;
          }
        }
    });

    this.ngSubscriptions.matrixState =  matrixState
      .subscribe((data: MatrixState) => {
        if (get(data, 'currencyUnit', false)
          && this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
        }

        if (get(data, 'timeUnit', false)
        && this.timeUnit !== data.timeUnit ) {
            this.timeUnit = data.timeUnit;
        }

        if (get(data, 'timeUnits', false)
        && this.timeUnits !== data.timeUnits ) {
          this.timeUnits = data.timeUnits;
          this.changeTimeUnit(this.timeUnit.code);
        }

        if (this.timeUnit && this.currencyUnit && this.place) {
          const income = this.incomeCalcService.calcPlaceIncome(this.place.income, this.timeUnit.code, this.currencyUnit.value)
          this.place.showIncome = income.toString();
        }

    });

    this.ngSubscriptions.timeUnitTranslation = combineLatest(matrixState, languageState)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe( (arr: [MatrixState, LanguageState]) => {
        const matrix = arr[0];
        const language = arr[1];

        this.getTimeUnitTranslations(matrix.timeUnit, language.translations)
      })

    this.ngSubscriptions.resize = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.zone.run(() => {
          this.windowInnerWidth = window.innerWidth;
          this.setMarkerPosition();
          if (this.familyData && get( this.familyData, 'familyData', false)) {
            this.familyData.description = this.getDescription(this.familyData.familyData);
          }
        });
      });

    this.ngSubscriptions.language = this.store
      .select((appStates: AppStates) => appStates.language)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((languageState: LanguageState) => {
      if (this.currentLanguage !== languageState.lang) {
        this.currentLanguage = languageState.lang;
      }
    });
  }

  getTimeUnitTranslations(timeUnit: TimeUnit, translations: TranslationsInterface): void {
    if (this.timeUnit !== timeUnit) {
      this.timeUnit = timeUnit;
    }

    const translation = get(translations, timeUnit.code, timeUnit.name);
    this.timeUnit.translationCode = translation;
  }

  public changeTimeUnit(code: string): void {
    this.timeUnit = this.timeUnits.find(unit => unit.code === code);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.initViewBlock();
  }

  // tslint:disable-next-line
  public initViewBlock(): void {
    if (!get(this.place, 'background', false)){
      return;
    }

    this.resetLoadedImage();


    this.showblock = true;
    this.loader = false;

    this.place.background = this.place.background.replace(this.imageResolution.image, this.imageResolution.expand);
    this.mapData = {region: this.place.region, lat: this.place.lat, lng: this.place.lng};

    this.viewImage = this.place.background;

    setTimeout(() => this.setMarkerPosition(), 0);

    const query = `placeId=${this.place._id}&thingId=${this.thing}${this.languageService.getLanguageParam()}`;

    if (get(this.ngSubscriptions, 'familyInfoService', false)) {
      this.ngSubscriptions.familyInfoService.unsubscribe();
    }

    this.ngSubscriptions.familyInfoService = this.familyInfoService.getFamilyInfo(query).subscribe((res: any) => {
      if (res.err) {
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

      const parsedUrl: UrlParameters = this.utilsService.parseUrl(this.query);

      this.familyData.goToPlaceData = parsedUrl;
      this.familyData.goToPlaceData.place = this.place._id;
      this.familyData.goToPlaceData.row = 1;
      this.isShowCountryButton = parsedUrl.countries !== this.familyData.country.originName;
      this.privateZoom = parsedUrl.zoom;

      this.loader = true;

      this.uploadImages(this.viewImage, 'main');
      if (get(this.familyData, 'familyImage', false)) {
        this.uploadImages(this.familyData.familyImage.url, 'familyImage');
      }
      if (get(this.familyData, 'houseImage', false)) {
        this.uploadImages(this.familyData.houseImage.url, 'houseImage');
      }
    });
  }

  public ngOnDestroy(): void {
    forEach(this.ngSubscriptions, (value, key) => {
      value.unsubscribe();
    });
  }

  public closeBlock(): void {
    this.urlParametersService.removeActiveHouse();
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
  }

  public fancyBoxClose(): void {
    this.popIsOpen = false;
    this.fancyBoxImage = void 0;
  }

  public visitThisHome(placeId: string): void {
    this.urlParametersService.resetRow();
    this.store.dispatch(new MatrixActions.SetPlace(placeId));
    this.streetService.clearAndRedraw();
  }

  public goToMatrixByCountry(country: string): void {

    const queryParams: UrlParameters = this.urlParametersService.getAllParameters();

    queryParams.regions = ['World'];
    queryParams.countries = [country];
    queryParams.lowIncome = this.streetData.poor.toString();
    queryParams.highIncome = this.streetData.rich.toString();

    delete queryParams.activeHouse;

    let queryUrl: string = this.utilsService.objToQuery(queryParams);

    this.store.dispatch(new AppActions.SetQuery(queryUrl));

    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(queryUrl));

    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.SetSelectedCountries(queryParams.countries));
    this.store.dispatch(new CountriesFilterActions.SetSelectedRegions(queryParams.regions));

    this.store.dispatch(new MatrixActions.RemovePlace({}));

    this.store.dispatch(new MatrixActions.UpdateMatrix(true));
    this.streetService.clearAndRedraw();

    this.urlChangeService.assignState('/matrix');

    this.pagePositionService.scrollTopZero();

  }


  public setMarkerPosition(): void {
    this.markerPositionLeft = (this.itemSize * this.positionInRow) - this.itemSize / 2;
  }

  public getDescription(shortDescription: string): string {
    // let numbers: number = 300;
    //
    // if (this.isDesktop) {
    //   if (this.windowInnerWidth > 1440 && shortDescription.length > 300) {
    //     numbers = 300;
    //   } else if (this.windowInnerWidth <= 1440 && shortDescription.length > 113) {
    //     numbers = 113;
    //   }
    // }
    //
    // if (shortDescription.length > numbers) {
    //   return shortDescription.slice(0, numbers) + '...';
    // } else {
    //   return shortDescription;
    // }
    return shortDescription + shortDescription;
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

  public goToPage(url: string, params: UrlParameters): void {
    this.urlParametersService.dispatchToStore(params);
  }

  resetLoadedImage(): void {
    this.zone.run(() => {
      forEach(this.imagesIsLoaded, (value, key) => {
        this.imagesIsLoaded[key] = false;
      });
    });
  }

  uploadImages(url: string, prop: string): void {
    this.imageService.imageLoaded(url).then(() => this.imagesIsLoaded[prop] = true);
  }
}
