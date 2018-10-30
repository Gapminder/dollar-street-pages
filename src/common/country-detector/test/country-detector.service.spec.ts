import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import {
  MockBackend
} from '@angular/http/testing';

import {
  BaseRequestOptions,
  Http,
  Response,
  ResponseOptions,
  XHRBackend,
  HttpModule
} from '@angular/http';

import { CountryDetectorService } from '../country-detector.service';

describe('CountryDetectorService', () => {
  let mockBackend: MockBackend;
  let countryDetectorService: CountryDetectorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        CountryDetectorService,
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

    TestBed.compileComponents();

    const testBed = getTestBed();
    mockBackend = testBed.get(MockBackend);
    countryDetectorService = testBed.get(CountryDetectorService);
  }));


  it('getCountry()', fakeAsync(() => {
    let response: any = void 0;
    let context: any = {as:'AS15772 LLC wnet Ukraine',city:'Kharkiv',country:'Ukraine',countryCode:'UA',
      isp:'LLC wnet Ukraine',lat:'49.9808',lon:'36.2527',org:'LLC wnet Ukraine',query:'80.92.227.49',region:'63',
      regionName:'Kharkivs\'ka Oblast\'', status:'success',timezone:'Europe/Kiev',zip:'61024'};


    mockBackend.connections.subscribe((connection: any) => {
      expect(connection.request.url).toEqual('http://ip-api.com/json');

      let mockResponse = new ResponseOptions({
        body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(context)}}`
      });

      connection.mockRespond(new Response(mockResponse));
    });

    countryDetectorService.getCountry().subscribe((data: any) => {
      response = data;
    });

    tick();
    expect(response.data.data).toEqual(context);

  }));
});
