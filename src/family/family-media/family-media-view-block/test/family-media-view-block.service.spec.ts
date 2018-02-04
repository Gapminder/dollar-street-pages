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

import { FamilyMediaViewBlockService } from '../family-media-view-block.service';

describe('FamilyMediaViewBlockService', () => {
    let mockBackend: MockBackend;
    let familyMediaViewBlockService: FamilyMediaViewBlockService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                FamilyMediaViewBlockService,
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
        familyMediaViewBlockService = testBed.get(FamilyMediaViewBlockService);
    }));

    it('getData()', fakeAsync(() => {
        const query: string = 'placeId=5571a085125eea582cbd257b&thingId=546ccf730f7ddf45c0179675&lang=en';
        let response: any = void 0;

        const context = {country:{region:'Europe',name:'Ukraine',countriesName:['France','Latvia','Netherlands','Romania','Russia','Sweden','Ukraine','United Kingdom']},
                                    article:{shortDescription:'A chimney or steam exit prevents household air pollution. For the poorest, solid fuels like animal dung or charcoal are often burnt for cooking and heating. These fuels produce hazardous fumes like carbon monoxide. To prevent the buildup of smoke over stoves, the poorest have gaps in the roofing, while wealthier homes have purpose-made ventilation. The richest use electronic steam extractors over their stoves.',
                                    isDescription:true}};

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/home-media-view-block?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        familyMediaViewBlockService.getData(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(context);
    }));
});
