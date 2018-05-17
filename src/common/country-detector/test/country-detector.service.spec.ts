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
    let context: any = {key: 'value'};

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
