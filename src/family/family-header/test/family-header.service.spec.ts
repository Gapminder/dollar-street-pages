import { async, fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';

import { FamilyHeaderService } from '../family-header.service';

describe('FamilyHeaderService', () => {
  let mockBackend: MockBackend;
  let familyHeaderService: FamilyHeaderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        FamilyHeaderService,
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
    familyHeaderService = testBed.get(FamilyHeaderService);
  }));

  it('getFamilyHeaderData()', fakeAsync(() => {
    const query: string = 'placeId=557164e181375e0f2c132073&lang=en';
    let response: any = void 0;

    const context: any = {
      _id: '557164e181375e0f2c132073',
      country: {_id: '55ef338d0d2b3c82037884dd', alias: 'Jordan', region: 'Asia', lat: 31, lng: 36},
      income: 583.1693665,
      familyName: 'Qors',
      familyInfoSummary: 'The Qors family lives in Amman, Jordan. Ahmed is 60 years old and works as a driver. His wife Eman is 49 years old and they live with their 3 children in a rented 3-bedroom house. The family likes the peaceful and quiet environment of the house, but the only thing they dislike is that it has too many stairs. Their favorite item in the house is the blankets. The next thing they plan on buying is a smart TV. Their dream is to buy their own house someday.","familyInfo":"The Qors family lives in Amman, Jordan. Ahmed is 60 years old, and works as a driver. His wife, Eman is 49 years old and they have 3 children. All their children are students and live with them in the same house. The son, Omar, is 22 years old and the 2 daughters Doha and Suja are 12 and 16 years old respectively. Ahmed works 48 hours per week and earns 480 Jordanian Dinars per month, which is approximately 583 USD/month (adjusted to purchasing power parity).\n\nThe Qors family has lived in their current dwelling for 10 years, and pays 100 Jordanian Dinars (141 USD) per month in rent. They enjoy their home’s quiet neighborhood, but wish that it didn’t have so many stairs. Their favorite items in the home are their blankets. Electricity is reliable and there is a toilet in the home, but the drinking water is not safe. \n\nThe family purchases all of its food supplies, and cooks it in a stove that requires propane as fuel. The food bill is 50% of the household income; water requires less than 10%. \n\nTheir last vacation was many years ago, and lasted two days. The farthest they have ever been was to Damascus, Syria. The next thing they plan on buying is a smart TV. Their dream is to buy their own house someday.","aboutData":"In this household each adult can consume goods and services worth about 583 US dollars each month. This consumption includes the things they buy as well as the things they produce for themselves (if any). We estimated this figure based on the assets the family owned and the incomes they reported.',
      commonAboutData: '',
      thing: 'Families',
      image: '//static.dollarstreet.org/media/Jordan 2/image/ccfd1fe3-bdd8-49dc-a118-67fcd781b4b7/thumb-ccfd1fe3-bdd8-49dc-a118-67fcd781b4b7.jpg',
      familyThingId: '546ccf730f7ddf45c017962f'
    };

    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url.indexOf(`/v1/home-header?${query}`)).toBeGreaterThan(-1);

      let mockResponse = new ResponseOptions({
        body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(context)}}`
      });

      connection.mockRespond(new Response(mockResponse));
    });

    familyHeaderService.getFamilyHeaderData(query).subscribe((_data: any) => {
      response = _data;
    });

    tick();

    expect(!response.err).toBe(true);
    expect(response.data).toEqual(context);
    expect(response.data._id).toEqual('557164e181375e0f2c132073');
  }));
});
