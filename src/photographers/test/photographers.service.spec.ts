import { TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { PhotographersService } from '../photographers.service';

let requestParams;
const photographersData = {
  "countryList": [{
    "name": "Bangladesh",
    "photographers": [{
      "name": "Gmb Akash",
      "userId": "56ec0913af72e9437cbccf85",
      "avatar": "url(\"//static.dollarstreet.org/users/56ec0913af72e9437cbccf85/avatar.jpg\")",
      "images": 107,
      "places": 1
    }, {
      "name": "Luc Forsyth",
      "userId": "56ec0918af72e9437cbccf97",
      "avatar": "url(\"//static.dollarstreet.org/users/56ec0918af72e9437cbccf97/avatar.jpg\")",
      "images": 393,
      "places": 4
    }, {
      "name": "Victrixia Montes",
      "userId": "56ec0916af72e9437cbccf90",
      "avatar": "url(\"//static.dollarstreet.org/users/56ec0916af72e9437cbccf90/avatar.jpg\")",
      "images": 635,
      "places": 5
    }, {
      "name": "Zoriah Miller",
      "userId": "56ec0917af72e9437cbccf93",
      "avatar": "url(\"//static.dollarstreet.org/users/56ec0917af72e9437cbccf93/avatar.jpg\")",
      "images": 14590,
      "places": 47
    }]
  }]
};

class MockHttp {
  response = [{
    "_body": JSON.stringify({
      "data": JSON.stringify(photographersData)
    })
  }];

  get(params) {
    requestParams = params;

    return this.response;
  }
}

describe('PhotographersService', () => {
  let http: MockHttp;
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotographersService,
        {provide: Http, useClass: MockHttp}
      ]
    });

    http = TestBed.get(Http);
    service = TestBed.get(PhotographersService);
  });

  it('should call query from arguments', () => {
    const query = 'lang=en';
    spyOn(http, 'get').and.callThrough();

    expect(service).toBeDefined();
    service.getPhotographers(query);

    expect(requestParams).toContain(`/v1/photographers?${query}`);
  });

  it('should return parsed data', () => {
    const response = JSON.parse(service.getPhotographers('query')[0].data);
    expect(response).toEqual(photographersData);
  });
});
