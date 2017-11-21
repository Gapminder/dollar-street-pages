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
  public timeUnits: any;
  public timeUnit: any;
  public currencyUnit: any;
  public currencyUnits: any[];

  public constructor(countryPlacesService: CountryPlacesService,
                     loaderService: LoaderService,
                     math: MathService,
                     languageService: LanguageService,
                     private store: Store<AppStates>,
                     private incomeCalcService: IncomeCalcService) {
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
        if (data.timeUnit) {
          if (this.timeUnit !== data.timeUnit) {
            this.timeUnit = data.timeUnit;
          }
        }

        if (data.currencyUnit) {
          if (this.currencyUnit !== data.currencyUnit) {
            this.currencyUnit = data.currencyUnit;
          }
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.loaderService.setLoader(false);
    this.countryPlacesServiceSubscribe.unsubscribe();

    if (this.matrixStateSubscription) {
      this.matrixStateSubscription.unsubscribe();
    }
  }

  public calcPlacesIncome(): void {
    this.places = this.places.map((place) => {
      if (place) {
        place.showIncome = this.incomeCalcService.calcPlaceIncome(place.income, this.timeUnit.code, this.currencyUnit.value);

        return place;
      }
    });
  }
}
