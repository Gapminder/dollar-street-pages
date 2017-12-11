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
import { DonateService } from '../donate.service';

describe('DonateService', () => {
    let mockBackend: MockBackend;
    let donateService: DonateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                DonateService,
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
        donateService = TestBed.get(DonateService);
    });

    it('ngOnInit()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/donate`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"error":null}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        donateService.makeDonate(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.error).toBe(true);
    }));
});
