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
import { AboutService } from '../about.service';

describe('AboutService', () => {
    let mockBackend: MockBackend;
    let aboutService: AboutService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AboutService,
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
        aboutService = testBed.get(AboutService);
    }));

    it('getInfo()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        let context = '<p>&nbsp;</p>\n<h1 style=\"text-align: center;\">Welcome in Dollar Street project!</h1>\n<p style=\"text-align: center;\">In future here will be info about data of this project.</p>\n<p style=\"text-align: center;\"><br /><img src2=\"http://www.web-and-art.com/wp-content/uploads/2015/05/dollar-street-4.png\" alt=\"test\" width=\"1200\" height=\"600\" /></p>\n<p style=\"text-align: center;\">&nbsp;</p>\n<p style=\"text-align: center;\">Some text about the data&nbsp;Some text about the data&nbsp;Some text about the data</p>\n<p style=\"text-align: center;\">&nbsp;</p>';

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/info?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data":{"_id":"572b2f133d4756bc524125ff","context": ${JSON.stringify(context)}}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        aboutService.getInfo(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data._id).toEqual('572b2f133d4756bc524125ff');
        expect(response.data.context).toEqual(context);
    }));
});
