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

import { FamilyService } from '../family.service';

describe('FamilyService', () => {
    let mockBackend: MockBackend;
    let familyService: FamilyService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              HttpModule
            ],
            providers: [
              FamilyService,
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
        familyService = testBed.get(FamilyService);
    }));

    it('getThing()', fakeAsync(() => {
        const query: string = 'thingName=Families&lang=en';
        let response: any = void 0;

        const context = {_id:'546ccf730f7ddf45c017962f',thingName:'Family',plural:'Families',originPlural:'Families',originThingName:'Family'};

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/thing?${query}`)).toBeGreaterThan(-1);

            const mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        familyService.getThing(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(context);
        expect(response.data._id).toEqual('546ccf730f7ddf45c017962f');
    }));
});
