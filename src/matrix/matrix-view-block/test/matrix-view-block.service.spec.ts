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
import { MatrixViewBlockService } from '../matrix-view-block.service';

describe('MatrixViewBlockService', () => {
    let mockBackend: MockBackend;
    let matrixViewBlockService: MatrixViewBlockService;

    const viewBlockData = {
        familyName:"Eucinaz",
        photographer:{name:"Zoriah Miller", id:"56ec0917af72e9437cbccf93"},
        familyData:"The Eucinaz family lives in the urban area of La Paz, Bolivia. Eduardo is 42 years old and works as a construction worker. His wife Virginia is 39 years old and runs a small restaurant business. They are parents to 5 children and live in a rented 1-bedroom house. They moved in the house since they migrated from the countryside and like it here as it’s close to the city center. However, the house is too small for their family. Their favorite item in the house is money. The next thing they plan on buying is a refrigerator. The family’s dream is to one day buy their own house.","country":{"_id":"55ef338d0d2b3c8203788469","country":"Bolivia","alias":"Bolivia","originName":"Bolivia"},"houseImage":{"_id":"54be2c718f6cdb1217b1dd91","url":"//static.dollarstreet.org/media/Bolivia 3/image/930b4dd1-1e79-4600-8adc-d0375200eae7/thumb-930b4dd1-1e79-4600-8adc-d0375200eae7.jpg","thing":"Home"},"activeThing":{"_id":"546ccf730f7ddf45c017962f","thingName":"Family","plural":"Families","originPlural":"Families","originThingName":"Family"},
        familyImage:{_id:"54be2ce58f6cdb1217b1dda9",url:"//static.dollarstreet.org/media/Bolivia 3/image/f95ebc6f-76a1-44f2-b98e-6acd1bab9afa/thumb-f95ebc6f-76a1-44f2-b98e-6acd1bab9afa.jpg",thing:"Family"}
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                MatrixViewBlockService,
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
        matrixViewBlockService = TestBed.get(MatrixViewBlockService);
    });

    it('getFamilyInfo()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/matrix-view-block/?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"data":${JSON.stringify(viewBlockData)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        matrixViewBlockService.getFamilyInfo(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.error).toBe(true);
        expect(response.data).toEqual(viewBlockData);
    }));
});