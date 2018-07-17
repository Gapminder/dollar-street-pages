import { Injectable } from '@angular/core';
import { AppStates, UrlParameters } from '../interfaces';
import { DEBOUNCE_TIME, DefaultUrlParameters, VisibleParametersPerPage } from '../defaultState';
import { difference, get, reduce } from 'lodash';
import * as StreetSettingsActions from '../common';
import { BrowserDetectionService, IncomeCalcService, LanguageService, UtilsService } from '../common';

import { Store } from '@ngrx/store';
import * as AppActions from '../app/ngrx/app.actions';
import * as MatrixActions from '../matrix/ngrx/matrix.actions';
import * as ThingsFilterActions from '../shared/things-filter/ngrx/things-filter.actions';
import * as CountriesFilterActions from '../shared/countries-filter/ngrx/countries-filter.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as LanguageActions from '../common/language/ngrx/language.actions';
import { LocalStorageService } from '../common/local-storage/local-storage.service';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class UrlParametersService {
  parameters: UrlParameters;
  window: Window = window;
  isMobile:boolean;
  public needPositionByRoute = null;
  public activeHouseByRoute = null;
  public activeImageByRoute = null;

  public constructor(
    private utilsService: UtilsService,
    public store: Store<AppStates>,
    private incomeCalcService: IncomeCalcService,
    private router: Router,
    private location: Location,
    private browserDetectionService: BrowserDetectionService,
    private languageService: LanguageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.parameters = Object.assign({}, DefaultUrlParameters);
    this.isMobile = this.browserDetectionService.isMobile() || this.browserDetectionService.isTablet();

    this.store.debounceTime(DEBOUNCE_TIME).subscribe((state: AppStates) => {
      const matrix = state.matrix;
      const languageState = state.language;
      const countriesFilter = state.countriesFilter;
      const streetSettings = get(state.streetSettings, 'streetSettings', undefined);

      if (get(languageState, 'lang', false)
        && this.parameters.lang !== languageState.lang) {
        this.parameters.lang = get(languageState, 'lang', DefaultUrlParameters.lang);
        this.combineUrlPerPage();
        this.window.location.reload();
      }

      if (!get(matrix, 'currencyUnit', false)
      && get(matrix, 'currencyUnits', false)) {
        const currencyUnit = this.incomeCalcService
          .getCurrencyUnitByCode(matrix.currencyUnits, this.parameters.currency, this.parameters.lang);

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

      this.parameters.embed = get(matrix, 'embedSetId', undefined);


      if (get(matrix, 'zoom', undefined) &&
        get(matrix, 'zoom', undefined) !== get(this.parameters, 'zoom', DefaultUrlParameters.zoom)) {
        this.store.dispatch(new MatrixActions.ChangeZoom(matrix.zoom));
        this.parameters.zoom = matrix.zoom.toString();
      }

      this.parameters.countries = get(countriesFilter, 'selectedCountries', DefaultUrlParameters.countries);
      this.parameters.regions = get(countriesFilter, 'selectedRegions', DefaultUrlParameters.regions);

      this.parameters.highIncome = get(streetSettings, 'filters.highIncome', DefaultUrlParameters.highIncome).toString();
      this.parameters.lowIncome = get(streetSettings, 'filters.lowIncome', DefaultUrlParameters.lowIncome).toString();



      this.combineUrlPerPage();
    });
  }

  parseString(urlString: string): UrlParameters {
    if (urlString.indexOf('?') === -1) {
      const additionParams: UrlParameters = {};
      if (this.isMobile) {
        additionParams.zoom = DefaultUrlParameters.mobileZoom;
      }

      return Object.assign({}, DefaultUrlParameters, additionParams);
    }
    urlString = urlString.slice(urlString.indexOf('?') + 1);
    const params = this.utilsService.parseUrl(urlString);

    if (this.isMobile) {
      params.zoom = DefaultUrlParameters.mobileZoom;
    }

    return Object.assign( {}, DefaultUrlParameters, params);
  }

  combineUrlPerPage(): void {
    const path = this.router.url.split('?')[0];

    const params =this.getParamsStingForPage(path);
    const line = params.length ? `?${params}` : params;
    this.location.replaceState(path, line);
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
      case 'zoom':
        if (this.isMobile) {
          string = '';
        } else {
          string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${this.parameters[param]}` : '';
        }
        break;
      case 'activeHouse':
        string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${Number(this.parameters[param]) + 1}` : '';
        break;
      case 'activeImage':
        string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${Number(this.parameters[param]) + 1}` : '';
        break;
      default:
          string = this.parameters[param] !== DefaultUrlParameters[param] ? `${param}=${this.parameters[param]}` : '';
    }

    return encodeURI(string);
  }

  getParamsStingForPage(page: string): string {
    const visibleParameters = get(VisibleParametersPerPage, page, VisibleParametersPerPage['other']);
    const line = reduce(visibleParameters, (result: string[], value: string) => {
      if (get(this.parameters, value, false)) {
        const cell = this.getStringFromParams(value);
        if (cell.length) {
          result.push(cell);
        }
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

    if (get(params, 'embed', false)
      && get(params, 'embed') !== 'undefined') {
      this.store.dispatch(new MatrixActions.SetEmbededId(params.embed));
    }

    if (get(params, 'lang', false)) {
      this.store.dispatch(new LanguageActions.UpdateLanguage(params.lang));
      this.languageService.changeLanguage(params.lang);
    }

    if (get(params, 'zoom', false)) {
      this.store.dispatch(new MatrixActions.ChangeZoom(params.zoom));
    }

    if (get(params, 'lowIncome', false)
      || get(params, 'highIncome', false)) {
      this.store.dispatch(new StreetSettingsActions.UpdateStreetFilters({
        lowIncome: Number(get(params, 'lowIncome', DefaultUrlParameters.lowIncome )),
        highIncome: Number(get(params, 'highIncome', DefaultUrlParameters.highIncome))
      }));
    }

  }

  public getAllParameters(): UrlParameters {
    return this.parameters;
  }

  public setGridPosition(row: string | number): void {
    if (row.toString() !== this.parameters.row) {
      this.parameters.row = row.toString();
      this.combineUrlPerPage();
    }
  }

  public setActiveHouse(activeHouse: string | number): void {
    if (activeHouse.toString() !== this.parameters.activeHouse) {
      this.parameters.activeHouse = activeHouse.toString();
      this.combineUrlPerPage();
    }
  }

  public removeActiveHouse(): void {
      this.parameters.activeHouse = undefined;
    this.combineUrlPerPage();
  }

  public setActiveImage(activeImage: string | number): void {
    if (activeImage.toString() !== this.parameters.activeHouse) {
      this.parameters.activeImage = activeImage.toString();
      this.combineUrlPerPage();
    }
  }

  public removeActiveImage(): void {
    this.parameters.activeImage = undefined;
    this.combineUrlPerPage();
  }

  isCurrentPage(name: string): boolean {
    const shap = this.activatedRoute.snapshot.root.children.map(child => child.url).map(snap => snap.map(s => s.path));

    if (shap) {
      if (shap[0][0] === name) {
        return true;
      }
    }

    return false;
  }
}
