import { TestBed, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { environment } from '../../../environments/environment';
import { LanguageService } from '../language.service';
import { UrlChangeService } from '../../url-change/url-change.service';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { UtilsService } from '../../utils/utils.service';
import { UrlChangeServiceMock, UtilsServiceMock } from '../../../test/';
import { CommonServicesTestingModule } from '../../../test/commonServicesTesting.module';
import { LocalStorageServiceMock } from '../../../test/mocks/localStorage.service.mock';

describe('LanguageService Test', () => {
  let mockBackend: MockBackend;
  let service: LanguageService;
  let localStorageService: LocalStorageServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonServicesTestingModule,
        HttpModule
      ],
      providers: [
        LanguageService,
        BaseRequestOptions,
        MockBackend,
        {
          deps: [
            MockBackend,
            BaseRequestOptions
          ],
          provide: Http,
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }
        },
        { provide: Location, useClass: SpyLocation }
      ]
    });

    mockBackend = TestBed.get(MockBackend);
    localStorageService = TestBed.get(LocalStorageService);
    service = TestBed.get(LanguageService);
  }));

  it('check default language', () => {
    expect(service.defaultLanguage).toBe('en');
  });

  it('loadLanguage recieved translations for current language', () => {
    const translations: any = { ABOUT: 'About', WORLD: 'World' };
    const bodyContext: any = `{"success":true,"error":false,"msg":[],"data":${JSON.stringify(translations)}}`;
    const expectedLang = 'en';

    service.currentLanguage = expectedLang;

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${environment.consumerApi}/v1/language?lang=${expectedLang}`);

      let response = new ResponseOptions({
        body: bodyContext
      });

      connection.mockRespond(new Response(response));
    });

    service.loadLanguage().subscribe(value => {
      expect(service.translations).toEqual(translations);
    });
  });

  it('getLanguagesList fetch and return languages list, don`t set currentLanguage if no so', () => {
    const languageList = [
      {_id: "58f5e173410ed2018368c67b", name: "English", code: "en"},
      {_id: "58f9e301d94606ffe8391eb9", code: "es-ES", name: "Español"}
    ];
    const bodyContext = `{"error": null,"data":${JSON.stringify(languageList)}}`;

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${environment.consumerApi}/v1/languagesList`);

      let response = new ResponseOptions({
        body: bodyContext
      });

      connection.mockRespond(new Response(response));
    });

    service.getLanguagesList().subscribe(returnedValue => {
      expect(returnedValue).toEqual({err: null, data: languageList});
    });
  });

  it('getLanguagesList set languageName from currentLanguage', () => {
    const languageList = [
      {_id: "58f5e173410ed2018368c67b", name: "English", code: "en"},
      {_id: "58f9e301d94606ffe8391eb9", code: "es-ES", name: "Español"}
    ];
    const bodyContext = `{"error": null,"data":${JSON.stringify(languageList)}}`;
    const currentLang = 'en';

    service.currentLanguage = currentLang;

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual(`${environment.consumerApi}/v1/languagesList`);

      let response = new ResponseOptions({
        body: bodyContext
      });

      connection.mockRespond(new Response(response));
    });

    service.getLanguagesList().subscribe(returnedValue => {
      expect(service.languageName).toEqual('English');
    });
  });

  it('getLanguageISO converted current language to iso format', () => {
    service.currentLanguage = 'en';
    expect(service.getLanguageIso()).toEqual('en_EN');

    service.currentLanguage = 'es-ES';
    expect(service.getLanguageIso()).toEqual('es_ES');

    service.currentLanguage = 'sv-SE';
    expect(service.getLanguageIso()).toEqual('sv_SE');
  });

  it('when string passed to getTranslation() it should return translated string', () => {
    let aboutTranslation;
    let worldTranslation;

    service.translations = { ABOUT: 'About', WORLD: 'World' };

    service.getTranslation('ABOUT').subscribe((_data: any) => {
      aboutTranslation = _data;
    });
    service.getTranslation('WORLD').subscribe((_data: any) => {
      worldTranslation = _data;
    });

    expect(aboutTranslation).toBe('About');
    expect(worldTranslation).toBe('World');
  });

  it('when array passed in getTraslation it should return object with translations', () => {
    const translations = { ABOUT: 'About', WORLD: 'World' };
    let allTranslated;

    service.translations = translations;

    service.getTranslation(['ABOUT']).subscribe((_data: any) => {
      allTranslated = _data;
    });

    expect(allTranslated).toEqual({ ABOUT: 'About' });
  });

  it('getTranslation should send translation to sibscribers', () => {
    let sub;
    const translations = {
      ABOUT: 'about'
    }
    service.translations = undefined;

    service.getTranslation('ABOUT').subscribe(value => {
      sub = value;
    });
    service.translationsLoadedEvent.emit(service.translationsLoadedString, translations);

    expect(sub).toEqual(translations.ABOUT);
  });

  it('changeLanuage set item to localStorage and update in url', () => {
    (service.window as any) = new windowMock();    
    spyOn(localStorageService, 'setItem').and.callThrough();

    service.window.location.href = '//fake/path&lang=en'
    service.changeLanguage('ru');

    expect(localStorageService.setItem).toHaveBeenCalledWith('language', 'ru');
    expect(service.window.location.href.includes('lang=ru')).toBe(true);
  });

});

class windowMock {
  location = {
    href: '//fake/path'
  }
}