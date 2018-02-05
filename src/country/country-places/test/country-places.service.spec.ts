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
import { CountryPlacesService } from '../country-places.service';
import { countryPlacesContext } from './mock.data';

describe('CountryPlacesService', () => {
    let mockBackend: MockBackend;
    let countryPlacesService: CountryPlacesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CountryPlacesService,
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
        countryPlacesService = testBed.get(CountryPlacesService);
    }));

    it('getCountryPlaces()', fakeAsync(() => {
        const query: string = 'id=55ef338d0d2b3c82037884bf&lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/country-places?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(countryPlacesContext)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        countryPlacesService.getCountryPlaces(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(countryPlacesContext);
        expect(response.data.country._id).toEqual('55ef338d0d2b3c82037884bf');
    }));
});
