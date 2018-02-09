import { TestBed, async, fakeAsync, tick, getTestBed } from '@angular/core/testing';

import { UrlParametersService } from "../url-parameters.service";

import { FamilyMediaService } from "../../family/family-media/family-media.service";
import { CommonServicesTestingModule } from "../../test/commonServicesTesting.module";
import { StoreModule } from "@ngrx/store";
import {
  BrowserDetectionService, IncomeCalcService, LanguageService, LocalStorageService, MathService,
  UtilsService
} from "../../common";
import { Router, RouterEvent } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateTestingModule } from "../../test/translateTesting.module";
import { UrlParametersServiceMock } from "../../test/mocks/url-parameters.service.mock";
import { StreetSettingsService } from "../../common/street-settings/street-settings.service";
import { PagePositionService } from "../../shared/page-position/page-position.service";
import { BrowserDetectionServiceMock } from "../../test/mocks/browserDetection.service.mock";
import { MathServiceMock } from "../../test/mocks/math.service.mock";
import { IncomeCalcServiceMock } from "../../test/mocks/incomeCalc.service.mock";
import { LoaderServiceMock } from "../../test/mocks/loader.service.mock";
import { UtilsServiceMock } from "../../test/mocks/utils.service.mock";
import { Angulartics2, Angulartics2GoogleAnalytics } from "angulartics2";
import { LocalStorageServiceMock } from "../../test/mocks/localStorage.service.mock";
import { LanguageServiceMock } from "../../test/mocks/language.service.mock";
import { AngularticsMock } from "../../test/mocks/angulartics.mock";
import { TitleHeaderServiceMock } from "../../test/mocks/titleHeader.service.mock";
import { LoaderService } from "../../common/loader/loader.service";
import { StreetSettingsServiceMock } from "../../test/mocks/streetSettings.service.mock";
import { UrlChangeServiceMock } from "../../test/mocks/urlChange.service.mock";
import { TitleHeaderService } from "../../common/title-header/title-header.service";
import { UrlChangeService } from "../../common/url-change/url-change.service";
import { PagePositionServiceMock } from "../../shared/page-position/test/page-position.service.mock";
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from "ng2-translate";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseRequestOptions, Http, HttpModule, XHRBackend } from "@angular/http";
import { MatrixService } from "../../matrix/matrix.service";
import { MockBackend } from "@angular/http/testing";
import { DEBOUNCE_TIME, DefaultUrlParameters } from "../../defaultState";
import * as CountriesFilterActions from "../../shared/countries-filter/ngrx/countries-filter.actions";

describe('UrlParametersService', () => {
  let urlParametersService: UrlParametersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        StoreModule.forRoot({}),
        RouterTestingModule
      ],
      declarations: [],
      providers: [
        UrlParametersService,
        { provide: UtilsService, useClass: UtilsServiceMock },
        { provide: IncomeCalcService, useClass: IncomeCalcServiceMock },
        { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock },
        { provide: LanguageService, useClass: LanguageServiceMock },
        {
          deps: [
          ],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });

    const testBed = getTestBed();

    urlParametersService = testBed.get(UrlParametersService);
  }));

  it('ActiveImage', () => {
    const combinePerPage = spyOn(urlParametersService, 'combineUrlPerPage');

    expect(urlParametersService.parameters.activeImage).toBeUndefined();

    urlParametersService.setActiveImage('1');

    expect(urlParametersService.combineUrlPerPage).toHaveBeenCalled();
    let count = combinePerPage.calls.count();
    expect(urlParametersService.parameters.activeImage).toBeDefined();

    urlParametersService.removeActiveImage();

    expect(urlParametersService.combineUrlPerPage).toHaveBeenCalledTimes(count + 1);
    expect(urlParametersService.parameters.activeImage).toBeUndefined();
  });

  it('ActiveHouse', () => {
    const combinePerPage = spyOn(urlParametersService, 'combineUrlPerPage');

    expect(urlParametersService.parameters.activeHouse).toBeUndefined();

    urlParametersService.setActiveHouse('1');

    expect(urlParametersService.combineUrlPerPage).toHaveBeenCalled();
    let count = combinePerPage.calls.count();
    expect(urlParametersService.parameters.activeHouse).toBeDefined();

    urlParametersService.removeActiveHouse();

    expect(urlParametersService.combineUrlPerPage).toHaveBeenCalledTimes(count + 1);
    expect(urlParametersService.parameters.activeHouse).toBeUndefined();
  })

  it('setGridPosition()', () => {
    spyOn(urlParametersService, 'combineUrlPerPage');
    urlParametersService.parameters = DefaultUrlParameters;

    expect(urlParametersService.parameters.row).toBe(DefaultUrlParameters.row);

    urlParametersService.setGridPosition(Number(DefaultUrlParameters) + 1);

    expect(urlParametersService.combineUrlPerPage).toHaveBeenCalled();
  });

  it('getAllParameters()', () => {
    urlParametersService.parameters = DefaultUrlParameters;

    expect(urlParametersService.parameters).toBeDefined();

    const params = urlParametersService.getAllParameters();

    expect(params).toEqual(DefaultUrlParameters);

  });

  it('dispatchToStore()', () => {
    let params = {
      row: '2',
      countries: ['Cameroon'],
    }

    urlParametersService.dispatchToStore(params);

    expect(urlParametersService.parameters).toEqual( Object.assign({}, DefaultUrlParameters, params) );

  });

  fit('getParamsStingForPage()', () => {
    const defaultParams = urlParametersService.getParamsStingForPage('unknow');

    expect(defaultParams).toEqual('');

    urlParametersService.dispatchToStore({countries: ['newCountry', 'oneMore'], zoom: '6'});
    const newRow = urlParametersService.getParamsStingForPage('/matrix');

    expect(newRow).toEqual('countries=newCountry,oneMore&zoom=6');
  });

  fit('getStringFromParams()', () => {
    let params = {
      row: '2',
      countries: ['Cameroon', 'anotherCountry'],
      lowIncome: '1000',
    }

    urlParametersService.parameters = Object.assign({}, DefaultUrlParameters, params);

    const row = urlParametersService.getStringFromParams('row');
    expect(row).toContain('row=2');

    const lowIncome = urlParametersService.getStringFromParams('lowIncome');
    expect(lowIncome).toContain('lowIncome=1000');

    const countries = urlParametersService.getStringFromParams('countries');
    expect(countries).toContain('countries=Cameroon,anotherCountry');
  });

});
