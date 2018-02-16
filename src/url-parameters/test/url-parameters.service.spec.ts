import { TestBed, async, getTestBed } from '@angular/core/testing';

import { UrlParametersService } from '../url-parameters.service';

import { StoreModule } from '@ngrx/store';
import {
  BrowserDetectionService, IncomeCalcService, LanguageService, LocalStorageService, MathService,
  UtilsService
} from '../../common';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDetectionServiceMock } from '../../test/mocks/browserDetection.service.mock';
import { IncomeCalcServiceMock } from '../../test/mocks/incomeCalc.service.mock';
import { UtilsServiceMock } from '../../test/mocks/utils.service.mock';
import { LanguageServiceMock } from '../../test/mocks/language.service.mock';
import { BaseRequestOptions, Http, HttpModule, XHRBackend } from '@angular/http';
import { DefaultUrlParameters } from '../../defaultState';

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
          deps: [],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        }
      ]
    });

    urlParametersService = TestBed.get(UrlParametersService);
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
      countries: ['Cameroon']
    }

    urlParametersService.dispatchToStore(params);

    expect(urlParametersService.parameters).toEqual(Object.assign({}, DefaultUrlParameters, params));

  });

  it('getParamsStingForPage()', () => {
    const defaultParams = urlParametersService.getParamsStingForPage('unknow');

    expect(defaultParams).toEqual('');

    urlParametersService.dispatchToStore({ countries: ['newCountry', 'oneMore'], zoom: '6' });
    const newRow = urlParametersService.getParamsStingForPage('/matrix');

    expect(newRow).toEqual('countries=newCountry,oneMore&zoom=6');
  });

  it('getStringFromParams()', () => {
    const params = {
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
