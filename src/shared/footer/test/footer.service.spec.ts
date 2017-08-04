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
import { FooterService } from '../footer.service';

describe('FooterService', () => {
    let mockBackend: MockBackend;
    let footerService: FooterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [],
            providers: [
                FooterService,
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

        mockBackend = TestBed.get(MockBackend);
        footerService = TestBed.get(FooterService);
    });

    it('getFooter()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        let context = '<p>Dollar Street is a Gapminder project - free for anyone to use.</p>\n<p>Today we feature more than 264 homes in 50 countries.</p>\n<p>In total we have more than 30 000 photos, and counting!</p>';

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/footer-text?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data":{"text": ${JSON.stringify(context)}},"error":null}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        footerService.getFooter(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data.text).toEqual(context);
    }));
});