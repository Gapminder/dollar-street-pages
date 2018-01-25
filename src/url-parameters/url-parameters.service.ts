import { Injectable } from '@angular/core';
import { AppStates, UrlParameters } from '../interfaces';
import { DefaultUrlParameters, VisibleParametersPerPage } from './defaultState';
import { forEach, get, reduce } from 'lodash';
import { IncomeCalcService, LanguageService, UtilsService } from '../common';

import { Store } from '@ngrx/store';
import * as AppActions from '../app/ngrx/app.actions';
import * as MatrixActions from '../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../shared/things-filter/ngrx/things-filter.actions';
import * as StreetSettingsActions from '../common';
import * as CountriesFilterActions from '../shared/countries-filter/ngrx/countries-filter.actions';
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Injectable()
export class UrlParametersService {
  parameters: UrlParameters = DefaultUrlParameters;

  public constructor(
    private utilsService: UtilsService,
    private store: Store<AppStates>,
    private incomeCalcService: IncomeCalcService,
    private router: Router,
    private location: Location,
    private languageService: LanguageService
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

      if (get(matrix, 'currencyUnit', false)) {
        this.parameters.currency = matrix.currencyUnit.code.toLowerCase()
      }

      if (!get(matrix, 'timeUnit', false)
        && get(matrix, 'timeUnits', false)) {
        const timeUnit = this.incomeCalcService.getTimeUnitByCode(matrix.timeUnits, this.parameters.time);
        console.log(timeUnit)
        this.store.dispatch(new MatrixActions.SetTimeUnit(timeUnit));
      }

      if (get(matrix, 'timeUnit', false)) {
        this.parameters.time = matrix.timeUnit.per
      }
      console.log(this.parameters.currency)
      this.combineUrlPerPage();
    });
  }

  parseString(urlString: string): UrlParameters {
    console.log(this.parameters);
    if (urlString.indexOf('?') === -1) {
      return DefaultUrlParameters;
    }
    urlString = urlString.slice(urlString.indexOf('?') + 1);
    const params = Object.assign( {}, DefaultUrlParameters, this.utilsService.parseUrl(urlString));

    return params;
  }

  combineUrlPerPage(): void {
    const path = this.router.url.split('?')[0];

    const visibleParameters = get(VisibleParametersPerPage, path, VisibleParametersPerPage['other']);
    let string = reduce(visibleParameters, (result: string[], value: string) => {
      const cell = this.getStringFromParams(value);
      if (cell.length) {
        result.push(cell);
      }
      return result;
    },[]).join('&');
    console.log(string);
    string = string.length ? `?${string}`: string;
    this.location.replaceState(path, string);
  }

  getStringFromParams(param: string): string {
    const string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${this.parameters[param]}` : '';
    console.log(this.parameters[param])
    // switch (param) {
    //   case 'lang':
    //     string += this.parameters.lang !== DefaultUrlParameters.lang ? `lang=${this.parameters.lang}` : '';
    //     break;
    //   case 'thing':
    //     string += this.parameters.thing !== DefaultUrlParameters.thing ? `thing=${this.parameters.thing}` : '';
    //     break;
    //   case 'countries':
    //     string += this.parameters.countries !== DefaultUrlParameters.countries ? `countries=${this.parameters.countries.join(',')}` : '';
    //     break;
    //   case 'regions':
    //     string += this.parameters.regions !== DefaultUrlParameters.regions ? `regions=${this.parameters.regions.join(',')}` : '';
    //     break;
    //   case 'zoom':
    //     string += this.parameters.zoom !== DefaultUrlParameters.zoom ? `zoom=${this.parameters.zoom}` : '';
    //     break;
    //   case 'row':
    //     string += this.parameters.row !== DefaultUrlParameters.row ? `row=${this.parameters.row}` : '';
    //     break;
    //   case 'lowIncome':
    //     string += this.parameters.lowIncome !== DefaultUrlParameters.lowIncome ? `lowIncome=${this.parameters.lowIncome}` : '';
    //     break;
    //   case 'row':
    //     string += this.parameters.highIncome !== DefaultUrlParameters.highIncome ? `row=${this.parameters.highIncome}` : '';
    //     break;
    //   case 'activeHouse':
    //     string += this.parameters.activeHouse !== DefaultUrlParameters.activeHouse ? `activeHouse=${this.parameters.activeHouse}` : '';
    //     break;
    //   case 'place':
    //     string += this.parameters.place !== DefaultUrlParameters.place ? `place=${this.parameters.place}` : '';
    //     break;
    //   case 'currency':
    //     string += this.parameters.currency !== DefaultUrlParameters.currency ? `place=${this.parameters.currency}` : '';
    //     break;
    //   case 'time':
    //     string += this.parameters.time !== DefaultUrlParameters.time ? `place=${this.parameters.time}` : '';
    //     break;
    //   default:
    //     string;
    // };

    return encodeURI(string);
  }

  getUrlForPage(page: string): string {
    return '';
  }

  dispachToStore(params): void {

    this.parameters = Object.assign({}, DefaultUrlParameters, this.parameters, params);
    console.log(params);

    const queryUrl: string = this.utilsService.objToQuery(this.parameters);
    this.store.dispatch(new StreetSettingsActions.GetStreetSettings());

    this.store.dispatch(new AppActions.SetQuery(queryUrl));

    this.store.dispatch(new ThingsFilterActions.GetThingsFilter(queryUrl));
    this.store.dispatch(new CountriesFilterActions.GetCountriesFilter(queryUrl));

    if (get(params, 'countries', false)) {
      this.store.dispatch(new CountriesFilterActions.SetSelectedCountries(params.countries));
    }

    if (get(params, 'regions', false)) {
      this.store.dispatch(new CountriesFilterActions.SetSelectedRegions(params.regions));
    }

    if (get(params, 'place', false)) {
      this.store.dispatch(new MatrixActions.SetPlace(params.place));
    }

    if (get(params, 'countries', false)
      || get(params, 'regions', false)
      || get(params, 'thing', false)) {
      this.store.dispatch(new MatrixActions.UpdateMatrix(true));
    }

    if (get(params, 'embed', false)) {
      this.store.dispatch(new MatrixActions.SetEmbededId(params.embed));
    }

    if (get(params, 'lang', false)) {
      this.languageService.changeLanguage(params.lang);
    }

  }

  setParameter(key, value) {

  }
}
