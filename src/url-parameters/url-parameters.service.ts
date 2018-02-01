import { Injectable } from '@angular/core';
import { AppStates, UrlParameters } from '../interfaces';
import { DefaultUrlParameters, VisibleParametersPerPage } from '../defaultState';
import { forEach, get, reduce, difference } from 'lodash';
import { BrowserDetectionService, IncomeCalcService, LanguageService, UtilsService } from '../common';

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
  parameters: UrlParameters;
  window: Window = window;
  isMobile:boolean;

  public constructor(
    private utilsService: UtilsService,
    private store: Store<AppStates>,
    private incomeCalcService: IncomeCalcService,
    private router: Router,
    private location: Location,
    private browserDetectionService: BrowserDetectionService,
    private languageService: LanguageService
  ) {
    const DEBOUCE_TIME = 50;
    this.parameters = Object.assign({}, DefaultUrlParameters);
    this.isMobile = this.browserDetectionService.isMobile() || this.browserDetectionService.isTablet();

    this.store.debounceTime(DEBOUCE_TIME).subscribe((state: AppStates) => {
      const matrix = state.matrix;
      const languageState = state.language;
      const countriesFilter = state.countriesFilter;

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
        this.store.dispatch(new MatrixActions.SetTimeUnit(timeUnit));
      }

      if (get(matrix, 'timeUnit', false)) {
        this.parameters.time = matrix.timeUnit.per;
      }

      this.parameters.place = get(matrix, 'place', undefined);

      if (get(languageState, 'lang', false)
      && this.parameters.lang !== languageState.lang) {
        this.parameters.lang = get(languageState, 'lang', DefaultUrlParameters.lang);
        this.window.location.reload();
      }

      this.parameters.embed = get(matrix, 'embedSetId', undefined);


      if (get(matrix, 'zoom', '') !== this.parameters.zoom) {
        this.store.dispatch(new MatrixActions.ChangeZoom(matrix.zoom));
        this.parameters.zoom = matrix.zoom.toString();
      }

      this.parameters.countries = countriesFilter.selectedCountries;
      this.parameters.regions = countriesFilter.selectedRegions;

      this.combineUrlPerPage();
    });
  }

  parseString(urlString: string): UrlParameters {
    if (urlString.indexOf('?') === -1) {
      return DefaultUrlParameters;
    }
    urlString = urlString.slice(urlString.indexOf('?') + 1);
     return Object.assign( {}, DefaultUrlParameters, this.utilsService.parseUrl(urlString));
  }

  combineUrlPerPage(): void {
    const path = this.router.url.split('?')[0];

    const params =this.getParamsStingForPage(path);
    const string = params.length ? `?${params}` : params;
    this.location.replaceState(path, string);
  }

  getStringFromParams(param: string): string {
    let string = '';

    switch (param) {
      case 'countries':
        string = difference(this.parameters[param].sort(), DefaultUrlParameters[param].sort()).length ? `${param}=${this.parameters[param].join(',')}` : '';
        break;
      case 'regions':
        string = difference(this.parameters[param].sort(),  DefaultUrlParameters[param].sort()).length ? `${param}=${this.parameters[param].join(',')}` : '';
        break;
      default:
          string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${this.parameters[param]}` : '';
    }
    return encodeURI(string);
  }

  getParamsStingForPage(page: string): string {
    const visibleParameters = get(VisibleParametersPerPage, page, VisibleParametersPerPage['other']);
    const line = reduce(visibleParameters, (result: string[], value: string) => {
      const cell = this.getStringFromParams(value);
      if (cell.length) {
        result.push(cell);
      }
      return result;
    }, []).join('&');

    return line;
  }

  dispatchToStore(params): void {
    this.parameters = Object.assign({}, DefaultUrlParameters, this.parameters, params);

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
    } else {
      this.store.dispatch(new MatrixActions.RemovePlace({}));
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

    if (get(params, 'zoom', false)) {
      this.store.dispatch(new MatrixActions.ChangeZoom(params.zoom));
    }

  }

  public getAllParameters(): UrlParameters {
    return this.parameters;
  }
}
