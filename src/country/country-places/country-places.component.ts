import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
  MathService,
  LoaderService,
  LanguageService,
  IncomeCalcService
} from '../../common';
import { CountryPlacesService } from './country-places.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStates, LanguageState, SubscriptionsList } from '../../interfaces';
import * as _ from 'lodash';
import { UrlParametersService } from "../../url-parameters/url-parameters.service";
import * as MatrixActions from '../../matrix/ngrx/matrix.actions';
import { DEBOUNCE_TIME } from '../../defaultState';
import { get, forEach } from 'lodash';

@Component({
  selector: 'country-places',
  templateUrl: './country-places.component.html',
  styleUrls: ['./country-places.component.css']
})
export class CountryPlacesComponent implements OnInit, OnDestroy {
  @Input()
  public countryId: string;

  public places: any = [];
  public country: any;
  public math: MathService;
  public loaderService: LoaderService;
  public countryPlacesService: CountryPlacesService;
  public countryPlacesServiceSubscribe: Subscription;
  public languageService: LanguageService;
  public currentLanguage: string;
  public matrixStateSubscription: Subscription;
  public matrixState: Observable<any>;
  public timeUnit: any;
  public currencyUnit: any;
  ngSubscriptions: SubscriptionsList = {};

  public constructor(countryPlacesService: CountryPlacesService,
                     loaderService: LoaderService,
                     math: MathService,
                     languageService: LanguageService,
                     private store: Store<AppStates>,
                     private incomeCalcService: IncomeCalcService,
                     private urlParametersService: UrlParametersService) {
    this.countryPlacesService = countryPlacesService;
    this.math = math;
    this.loaderService = loaderService;
    this.languageService = languageService;

    this.currentLanguage = this.languageService.currentLanguage;
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    const query: string = `id=${this.countryId}${this.languageService.getLanguageParam()}`;

    this.ngSubscriptions.countryPlacesService = this.countryPlacesService
      .getCountryPlaces(query)
      .subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.country = res.data.country;
        this.places = res.data.places;

        this.calcPlacesIncome();

        this.loaderService.setLoader(true);
      });

    this.ngSubscriptions.matrixState = this.store
      .select((appStates: AppStates) => appStates.matrix)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((data: any) => {
      if (data) {
        this.timeUnit = _.get(data, 'timeUnit', this.timeUnit);
        this.currencyUnit = _.get(data, 'currencyUnit', this.currencyUnit);
      }
    });

    this.ngSubscriptions.languageState = this.store
      .select((appState: AppStates) => appState.language)
      .debounceTime(DEBOUNCE_TIME)
      .subscribe((language: LanguageState) => {
        if (language.lang !== this.currentLanguage) {
          this.currentLanguage = language.lang;
        }
      });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);

    forEach(this.ngSubscriptions, (subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  public calcPlacesIncome(): void {
    this.places = this.places.map((place) => {
      if (this.timeUnit && this.currencyUnit) {
        place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, this.timeUnit.code, this.currencyUnit.value);
      } else {
        place.showIncome = this.math.round(place.income);
        this.currencyUnit = {};
        this.currencyUnit.symbol = '$';
      }

      return place;
    });
  }

  public goToPage(params) {
    this.urlParametersService.dispatchToStore(params);
  }

  public visitThisHome(placeId: string): void {
    this.store.dispatch(new MatrixActions.SetPlace(placeId));
  }
}
