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
import { CountriesFilterService } from '../countries-filter.service';
import { countriesFilterContext } from './data.mock';

describe('CountriesFilterService', () => {
    let mockBackend: MockBackend;
    let countriesFilterService: CountriesFilterService;
    let response: any = void 0;

    const query: string = '&things=Families';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CountriesFilterService,
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
        countriesFilterService = testBed.get(CountriesFilterService);
    }));

    it('getCountries()', fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/countries-filter?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":"true","error":"false","msg":[],"data":${JSON.stringify(countriesFilterContext)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        countriesFilterService.getCountries(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.error).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.data.length).toBe(4);
    }));
});
