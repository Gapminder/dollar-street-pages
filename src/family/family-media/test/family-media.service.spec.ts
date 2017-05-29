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

import { FamilyMediaService } from '../family-media.service';

import { mockFamilyMediaContext } from './mock.data';

describe('FamilyMediaService', () => {
    let mockBackend: MockBackend;
    let familyMediaService: FamilyMediaService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                FamilyMediaService,
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
        familyMediaService = testBed.get(FamilyMediaService);
    }));

    it('getFamilyMedia()', fakeAsync(() => {
        const query: string = 'placeId=55646e1512d20a701a1e19eb&resolution=480x480&lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/home-media?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"error":null,"data": ${JSON.stringify(mockFamilyMediaContext)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        familyMediaService.getFamilyMedia(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(mockFamilyMediaContext);
    }));
});
