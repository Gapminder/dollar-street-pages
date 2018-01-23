import { Injectable } from '@angular/core';
import { AppStates, UrlParameters } from '../interfaces';
import { DefaultUrlParameters, VisibleParametersPerPage } from './defaultState';
import { forEach, get } from 'lodash';
import { IncomeCalcService, UtilsService } from '../common';

import { Store } from '@ngrx/store';
import * as AppActions from '../app/ngrx/app.actions';
import * as MatrixActions from '../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../shared/things-filter/ngrx/things-filter.actions';
import * as StreetSettingsActions from '../common';
import * as CountriesFilterActions from '../shared/countries-filter/ngrx/countries-filter.actions';

@Injectable()
export class UrlParametersService {
  parameters: UrlParameters = DefaultUrlParameters;

  public constructor(
    private utilsService: UtilsService,
    private store: Store<AppStates>,
    private incomeCalcService: IncomeCalcService
  ) {
    this.store.debounceTime(50).subscribe((state: AppStates) => {
      console.log(state)

      const matrix = state.matrix;

      if (!get(matrix, 'currencyUnit', false)
      && get(matrix, 'currencyUnits', false)) {
        const currencyUnit = this.incomeCalcService
          .getCurrencyUnitByCode(matrix.currencyUnits, this.parameters.currency);

        this.store.dispatch(new MatrixActions.SetCurrencyUnit(currencyUnit));
      }

      if (!get(matrix, 'timeUnit', false)
        && get(matrix, 'timeUnits', false)) {
        const timeUnit = this.incomeCalcService.getTimeUnitByCode(matrix.timeUnits, this.parameters.time);
        console.log(timeUnit)
        this.store.dispatch(new MatrixActions.SetTimeUnit(timeUnit));
      }
    });
  }

  parseString(urlString: string): UrlParameters {
    if (urlString.indexOf('?') === -1) {
      return DefaultUrlParameters;
    }
    urlString = urlString.slice(urlString.indexOf('?') + 1);
    const params = Object.assign( {}, DefaultUrlParameters, this.utilsService.parseUrl(urlString));

    return params;
  }

  combineUrlPerPage(params: UrlParameters): void {
    const defaultParams = VisibleParametersPerPage;
  }

  dispachToStore(params): void {
    const queryUrl: string = this.utilsService.objToQuery(params);

    this.parameters = params;

    this.store.dispatch(new StreetSettingsActions.GetStreetSettings());

    this.store.dispatch(new AppActions.SetQuery(queryUrl));
    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.SetSelectedCountries(params.countries));
    this.store.dispatch(new CountriesFilterActions.SetSelectedRegions(params.regions));
  }
}
