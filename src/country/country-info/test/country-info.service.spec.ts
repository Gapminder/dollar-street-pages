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
import { CountryInfoService } from '../country-info.service';
import { countryInfoContext } from './mock.data';

describe('CountryInfoService', () => {
    let mockBackend: MockBackend;
    let countryInfoService: CountryInfoService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CountryInfoService,
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
        countryInfoService = testBed.get(CountryInfoService);
    }));

    it('getCountryInfo()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/country-info?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(countryInfoContext)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        countryInfoService.getCountryInfo(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(countryInfoContext);
    }));
});
