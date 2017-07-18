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

import { StreetSettingsService } from '../street-settings.service';

export interface DrawDividersInterface {
  showDividers: boolean;
  low: number;
  medium: number;
  high: number;
  poor: number;
  rich: number;
  lowDividerCoord: number;
  mediumDividerCoord: number;
  highDividerCoord: number;
}

describe('StreetSettingsService', () => {
    let mockBackend: MockBackend;
    let streetSettingsService: StreetSettingsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                StreetSettingsService,
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
        streetSettingsService = testBed.get(StreetSettingsService);
    }));

    it('getStreetSettings()', fakeAsync(() => {
        let response: any = void 0;

        let context = {_id:'57963211cc4aaed63a02504c',showDividers:false,low:30,medium:300,high:3000,poor:26,rich:15000,lowDividerCoord:78,mediumDividerCoord:490,highDividerCoord:920,__v:0};

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/street-settings`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":false,"msg":[],"data":${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        streetSettingsService.getStreetSettings().subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBeTruthy();
        expect(response.data._id).toEqual('57963211cc4aaed63a02504c');
        expect(response.data as DrawDividersInterface).toEqual(context);
    }));
});
