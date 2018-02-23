import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AppStates,
  StreetSettingsState,
  DrawDividersInterface,
  Thing, UrlParameters
} from '../../interfaces';
import {
  MathService,
  LanguageService,
  BrowserDetectionService, UrlChangeService, UtilsService
} from '../../common';
import { CountryInfoService } from './country-info.service';
import { get } from 'lodash';
import * as AppActions from '../../app/ngrx/app.actions';
import * as ThingsFilterActions from '../../shared/things-filter/ngrx/things-filter.actions';
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import * as CountriesFilterActions from '../../shared/countries-filter/ngrx/countries-filter.actions';
import { StreetDrawService } from '../../shared/street/street.service';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { PagePositionService } from '../../shared/page-position/page-position.service';

@Component({
  selector: 'country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.css']
})
export class CountryInfoComponent implements OnInit, OnDestroy {
  @Input()
  public countryId: string;
  @Output()
  public getCountry: EventEmitter<any> = new EventEmitter<any>();

  public mapData;
  public isShowInfo: boolean;
  public country;
  public thing: Thing;
  public placesQuantity: string;
  public photosQuantity: string;
  public videosQuantity: string;
  public math: MathService;
  public countryInfoService: CountryInfoService;
  public countryInfoServiceSubscribe: Subscription;
  public streetData: DrawDividersInterface;
  public languageService: LanguageService;
  public device: BrowserDetectionService;
  public streetSettingsState: Observable<StreetSettingsState>;
  public streetSettingsStateSubscription: Subscription;

  public constructor(countryInfoService: CountryInfoService,
                     math: MathService,
                     languageService: LanguageService,
                     browserDetectionService: BrowserDetectionService,
                     private store: Store<AppStates>,
                     private streetService: StreetDrawService,
                     private urlChangeService: UrlChangeService,
                     private urlParametersService: UrlParametersService,
                     private utilsService: UtilsService,
                     private pagePositionService: PagePositionService) {
    this.device = browserDetectionService;
    this.countryInfoService = countryInfoService;
    this.math = math;
    this.isShowInfo = false;
    this.languageService = languageService;

    this.streetSettingsState = this.store.select((appStates: AppStates) => appStates.streetSettings);
  }

  public ngOnInit(): void {
    this.streetSettingsStateSubscription = this.streetSettingsState.subscribe((data: StreetSettingsState) => {
      if (get(data, 'streetSettings', false)) {
        this.streetData = data.streetSettings;
      }
    });

    this.countryInfoServiceSubscribe = this.countryInfoService
      .getCountryInfo(`id=${this.countryId}${this.languageService.getLanguageParam()}`)
      .subscribe((res) => {
        if (get(res, 'err', false)) {
          return;
        }
        this.country = res.data.country;
        this.mapData = res.data.country;
        this.thing = res.data.thing;
        this.placesQuantity = this.device.isMobile() !== true ? Math.round(res.data.places).toString() : Math.round(res.data.places).toString().replace(/\s+/g, '');
        this.photosQuantity = this.device.isMobile() !== true ? Math.round(res.data.images).toString() : Math.round(res.data.images).toString().replace(/\s+/g, '');
        this.videosQuantity = Math.round(res.data.video) > 0 ? Math.round(res.data.video).toString() : '';
        this.getCountry.emit(this.country.alias || this.country.country);
      });
  }

  public ngOnDestroy(): void {
    this.countryInfoServiceSubscribe.unsubscribe();

    if (this.streetSettingsStateSubscription) {
      this.streetSettingsStateSubscription.unsubscribe();
    }
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
}
