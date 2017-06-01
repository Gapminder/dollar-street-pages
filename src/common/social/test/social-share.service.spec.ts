import { TestBed, async, getTestBed, fakeAsync } from '@angular/core/testing';

import {
    MockBackend
} from '@angular/http/testing';

import {
    BaseRequestOptions,
    Http,
    XHRBackend,
    HttpModule
} from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';

import { TranslateModule, TranslateLoader, TranslateService } from 'ng2-translate';

import { SocialShareService } from '../social-share.service';
import { LanguageService } from '../../language/language.service';
import { UrlChangeService } from '../../url-change/url-change.service';
import { LocalStorageService } from '../../guide/localstorage.service';
import { UtilsService } from '../../utils/utils.service';

/* tslint:disable */
class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}
/* tslint:enable */

describe('SocialShareService Test', () => {
    let socialShareService: SocialShareService;
    let mockedDocumentObject: Document;

    beforeEach(async(() => {
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
                LanguageService,
                TranslateService,
                LocalStorageService,
                UrlChangeService,
                MockBackend,
                BaseRequestOptions,
                UtilsService,
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
                { provide: Location, useClass: SpyLocation },
                { provide: Document, useFactory: () => {
                    let newDocument: Document = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', undefined);
                    let body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
                    let head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
                    let script = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');

                    head.appendChild(script);
                    body.appendChild(head);

                    newDocument.documentElement.appendChild(body);

                    return newDocument;
                }}
            ]
        });

        const testBed = getTestBed();
        socialShareService = testBed.get(SocialShareService);
        mockedDocumentObject = testBed.get(Document);
    }));

    it('SocialShareService: facebookLike()', fakeAsync(() => {
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
