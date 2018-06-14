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
import { MatrixService } from '../matrix.service';
import { matrixData } from './matrix.data';
import { UrlParametersService } from '../../url-parameters/url-parameters.service';
import { UrlParametersServiceMock } from '../../test/mocks/url-parameters.service.mock';

describe('MatrixService', () => {
    let mockBackend: MockBackend;
    let matrixService: MatrixService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [],
            providers: [
                MatrixService,
                MockBackend,
                BaseRequestOptions,
                { provide: UrlParametersService, useClass: UrlParametersServiceMock },
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
        matrixService = TestBed.get(MatrixService);
    });

    it('getMainPlaces()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/things?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data":${JSON.stringify(matrixData)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        matrixService.getMatrixImages(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(matrixData);
    }));
});
