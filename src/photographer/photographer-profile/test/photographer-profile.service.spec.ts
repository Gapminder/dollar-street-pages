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

import { PhotographerProfileService } from '../photographer-profile.service';

describe('PhotographerProfileService', () => {
    let mockBackend: MockBackend;
    let photographerProfileService: PhotographerProfileService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                PhotographerProfileService,
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
        photographerProfileService = testBed.get(PhotographerProfileService);
    }));

    it('getPhotographerProfile()', fakeAsync(() => {
        const query: string = '&id=56ec091caf72e9437cbccfab&lang=en';
        let response: any = void 0;

        const context: any = {places:[{_id:'54b51a173755cbfb542c2473',
                                         income:245.2917235,
                                         country:'India',
                                         family:'Durai',
                                         imageId:'54b51a573755cbfb542c247a',
                                         thing:'Family',
                                         image:'//static.dollarstreet.org/media/India 1/image/db6192ba-963f-48ba-ae73-1ece7c505109/thumb-db6192ba-963f-48ba-ae73-1ece7c505109.jpg',
                                         region:'Asia',
                                         placeId:'54b51a173755cbfb542c2473'},
                                         {_id:'54b51b835edc101155fa1ed2',
                                         income:724.3356801,
                                         country:'India',
                                         family:'Ramachandran',
                                         imageId:'54b51ba75edc101155fa1ed7',
                                         thing:'Family',
                                         image:'//static.dollarstreet.org/media/India 2/image/62f004cd-0ede-4a2c-bd57-6b8f4815baba/thumb-62f004cd-0ede-4a2c-bd57-6b8f4815baba.jpg',
                                         region:'Asia',
                                         placeId:'54b51b835edc101155fa1ed2'},
                                         {_id:'54b51c593755cbfb542c24a5',
                                         income:397.2755927,
                                         country:'India',
                                         family:'Abdul Kadhar',
                                         imageId:'54b51c8105df73e55431911b',
                                         thing:'Family',
                                         image:'//static.dollarstreet.org/media/India 3/image/42beb78b-0e1c-405f-9dc4-64c478de51aa/thumb-42beb78b-0e1c-405f-9dc4-64c478de51aa.jpg',
                                         region:'Asia',
                                         placeId:'54b51c593755cbfb542c24a5'},
                                         {_id:'54b520ed05df73e55431912b',
                                         income:465.5026805,
                                         country:'India',
                                         family:'Gada',
                                         imageId:'54b5213d38ef07015525f1bd',
                                         thing:'Family',
                                         image:'//static.dollarstreet.org/media/India 4/image/2d763a64-285b-4bd7-862e-cc1d3cb25132/thumb-2d763a64-285b-4bd7-862e-cc1d3cb25132.jpg',
                                         region:'Asia',
                                         placeId:'54b520ed05df73e55431912b'}]};

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/photographer-profile?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[], "data": ${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        photographerProfileService.getPhotographerProfile(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(context);
    }));
});
