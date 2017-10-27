import { Observable } from 'rxjs/Rx';
import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';
import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    XHRBackend,
    HttpModule
} from '@angular/http';
import * as _ from 'lodash';
import { Location, LocationStrategy } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateService } from 'ng2-translate';
import { LanguageService } from '../language.service';
import { UrlChangeService } from '../../url-change/url-change.service';
import { LocalStorageService } from '../../local-storage/local-storage.service';
import { UtilsService } from '../../utils/utils.service';
import { SpyLocation } from '@angular/common/testing';
import {
    UtilsServiceMock,
    LanguageServiceMock,
    UrlChangeServiceMock
} from '../../../test/';

/* tslint:disable */
class CustomLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.of({KEY: 'value'});
  }
}
/* tslint:enable */

describe('LanguageService', () => {
    let mockBackend: MockBackend;
    let languageService: LanguageService;

    const query: string = 'lang=en-EN';

    let context: any = {
        ABOUT: 'About',
        WORLD: 'World'
    };

    let bodyContext: any = `{"success":true,"error":false,"msg":[],"data":{"_id": "584a97f743ec2c1bd11673ec", "interface": ${JSON.stringify(context)}}}`;

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
                { provide: UrlChangeService, useClass: UrlChangeServiceMock },
                TranslateService,
                LocationStrategy,
                LocalStorageService,
                MockBackend,
                BaseRequestOptions,
                { provide: UtilsService, useClass: UtilsServiceMock },
                { provide: LanguageService, useClass: LanguageServiceMock },
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

        const testBed = getTestBed();
        mockBackend = testBed.get(MockBackend);
        languageService = testBed.get(LanguageService);
    }));

    it('getTranslation()', fakeAsync(() => {
        let allTranslated: any = void 0;

        let aboutTranslation: string = void 0;
        let worldTranslation: string = void 0;

        languageService.translations = { ABOUT: 'About', WORLD: 'World'};

        expect(languageService.getLanguageIso()).toBe('en_EN');

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/language?${query}`)).toBeGreaterThan(-1);

            let response = new ResponseOptions({
                body: bodyContext
            });

            connection.mockRespond(new Response(response));
        });

        languageService.getTranslation(['ABOUT', 'WORLD']).subscribe((_data: any) => {
            allTranslated = _data;
        });

        languageService.getTranslation('ABOUT').subscribe((_data: any) => {
            aboutTranslation = _data;
        });

        languageService.getTranslation('WORLD').subscribe((_data: any) => {
            worldTranslation = _data;
        });

        tick();

        const equal: boolean = _.isEqual(allTranslated, context);
        expect(equal).toBeTruthy();

        expect(aboutTranslation).toBe('About');
        expect(worldTranslation).toBe('World');
    }));
});
