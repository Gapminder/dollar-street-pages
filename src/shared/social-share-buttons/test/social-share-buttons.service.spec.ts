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
import { SocialShareButtonsService } from '../social-share-buttons.service';

describe('SocialShareButtonsService', () => {
    let mockBackend: MockBackend;
    let socialShareButtonsService: SocialShareButtonsService;
    let response: any = void 0;

    const query: string = '&lang=en';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                SocialShareButtonsService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [
                        MockBackend,
                        BaseRequestOptions
                    ],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });

        const testBed = getTestBed();
        mockBackend = testBed.get(MockBackend);
        socialShareButtonsService = testBed.get(SocialShareButtonsService);
    }));

    it('getUrl()', fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/shorturl`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"error": null, "data": "data", "url": "http://www"}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        socialShareButtonsService.getUrl(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.error).toBe(true);
        expect(response.url).toBeDefined();
    }));
});