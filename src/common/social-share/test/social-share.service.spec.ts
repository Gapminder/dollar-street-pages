import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from 'ng2-translate';

import { SocialShareService } from '../social-share.service';
import { LanguageService } from '../../language/language.service';
import { UrlChangeService } from '../../url-change/url-change.service';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { UtilsService } from '../../utils/utils.service';

import { LanguageServiceMock, UrlChangeServiceMock, UtilsServiceMock } from '../../../test/';

class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}

describe('Service.SocialShareService', () => {
  let socialShareService: SocialShareService;
  let mockedDocumentObject: Document;
  let languageService: LanguageServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useClass: CustomLoader
        })
      ],
      providers: [
        SocialShareService,
        TranslateService,
        LocalStorageService,
        MockBackend,
        BaseRequestOptions,
        {provide: UrlChangeService, useClass: UrlChangeServiceMock},
        {provide: UtilsService, useClass: UtilsServiceMock},
        {provide: LanguageService, useClass: LanguageServiceMock},
        {provide: Location, useClass: SpyLocation},
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
        {
          provide: Document, useFactory: () => {
          let newDocument: Document = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', undefined);
          let body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
          let head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
          let script = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');

          head.appendChild(script);
          body.appendChild(head);

          newDocument.documentElement.appendChild(body);

          return newDocument;
        }
        }
      ]
    });

    languageService = TestBed.get(LanguageService);
    socialShareService = TestBed.get(SocialShareService);
    mockedDocumentObject = TestBed.get(Document);
  });

  it('SocialShareService: facebookLike()', fakeAsync(() => {
    spyOn(languageService, 'getLanguagesList').and.returnValue(Observable.of({}));
    socialShareService.document = mockedDocumentObject;
    socialShareService.facebookLike();

    let fbScript: HTMLElement = mockedDocumentObject.getElementById(socialShareService.facebookElementId);

    expect(fbScript).toBeDefined();
  }));

  it('SocialShareService: twitterFollow()', fakeAsync(() => {
    socialShareService.document = mockedDocumentObject;
    socialShareService.twitterFollow();

    let twScript: HTMLElement = mockedDocumentObject.getElementById(socialShareService.twitterElementId);

    expect(twScript).toBeDefined();
  }));
});
