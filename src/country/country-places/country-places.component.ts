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
import { AppStates } from '../../interfaces';
import * as _ from 'lodash';
import { UrlParametersService } from "../../url-parameters/url-parameters.service";

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

    this.matrixState = this.store.select((appStates: AppStates) => appStates.matrix);
  }

  public ngOnInit(): void {
    this.loaderService.setLoader(false);

    const query: string = `id=${this.countryId}${this.languageService.getLanguageParam()}`;

    this.countryPlacesServiceSubscribe = this.countryPlacesService
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

    this.matrixStateSubscription = this.matrixState.subscribe((data: any) => {
      if (data) {
        this.timeUnit = _.get(data, 'timeUnit', this.timeUnit);
        this.currencyUnit = _.get(data, 'currencyUnit', this.currencyUnit);
      }
    });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);
    this.countryPlacesServiceSubscribe.unsubscribe();
    this.matrixStateSubscription.unsubscribe();
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
    this.urlParametersService.dispachToStore(params);
  }
}
