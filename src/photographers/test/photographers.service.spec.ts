import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
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
import { PhotographersService } from '../photographers.service';

describe('PhotographersService', () => {
    let mockBackend: MockBackend;
    let photographersService: PhotographersService;

    const photographersData = {"countryList":[{"name":"Bangladesh","photographers":[{"name":"Gmb Akash","userId":"56ec0913af72e9437cbccf85","avatar":"url(\"//static.dollarstreet.org/users/56ec0913af72e9437cbccf85/avatar.jpg\")","images":107,"places":1},{"name":"Luc Forsyth","userId":"56ec0918af72e9437cbccf97","avatar":"url(\"//static.dollarstreet.org/users/56ec0918af72e9437cbccf97/avatar.jpg\")","images":393,"places":4}]},{"name":"Bolivia","photographers":[{"name":"Zoriah Miller","userId":"56ec0917af72e9437cbccf93","avatar":"url(\"//static.dollarstreet.org/users/56ec0917af72e9437cbccf93/avatar.jpg\")","images":592,"places":3}]},{"name":"Brazil","photographers":[{"name":"Aleksander Schoeffel","userId":"59358360a00fa678c0ac781e","avatar":"url(\"//static.dollarstreet.org/users/59358360a00fa678c0ac781e/avatar.jpg\")","images":138,"places":1}]},{"name":"Burkina Faso","photographers":[{"name":"Zoriah Miller","userId":"56ec0917af72e9437cbccf93","avatar":"url(\"//static.dollarstreet.org/users/56ec0917af72e9437cbccf93/avatar.jpg\")","images":670,"places":4}]},{"name":"Burundi","photographers":[{"name":"Johan Eriksson","userId":"56ec0916af72e9437cbccf91","avatar":"url(\"//static.dollarstreet.org/users/56ec0916af72e9437cbccf91/avatar.jpg\")","images":322,"places":3}]},{"name":"Cambodia","photographers":[{"name":"Luc Forsyth","userId":"56ec0918af72e9437cbccf97","avatar":"url(\"//static.dollarstreet.org/users/56ec0918af72e9437cbccf97/avatar.jpg\")","images":425,"places":4}]},{"name":"Cameroon","photographers":[{"name":"Rosine Fidele","userId":"58b5b2d7b9b71e08ed5e2f27","avatar":"url(\"//static.dollarstreet.org/users/58b5b2d7b9b71e08ed5e2f27/avatar.jpg\")","images":343,"places":4}]},{"name":"Swapan Banik","userId":"5851167e61c2d50916493f05","avatar":"url(\"//static.dollarstreet.org/users/5851167e61c2d50916493f05/avatar.jpg\")","images":100,"places":1},{"name":"Victrixia Montes","userId":"56ec0916af72e9437cbccf90","avatar":"url(\"//static.dollarstreet.org/users/56ec0916af72e9437cbccf90/avatar.jpg\")","images":635,"places":5},{"name":"Zoriah Miller","userId":"56ec0917af72e9437cbccf93","avatar":"url(\"//static.dollarstreet.org/users/56ec0917af72e9437cbccf93/avatar.jpg\")","images":14590,"places":47}]};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [],
            providers: [
                PhotographersService,
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
        photographersService = TestBed.get(PhotographersService);
    });

    it('getMainPlaces()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/photographers?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data":${JSON.stringify(photographersData)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        photographersService.getPhotographers(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(photographersData);
    }));
});