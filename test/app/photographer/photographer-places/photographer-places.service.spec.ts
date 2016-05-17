import {
  it,
  describe,
  inject,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {MockBackend} from '@angular/http/testing';
import {provide} from '@angular/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions
} from '@angular/http';

import {config} from '../../../../app/app.config.ts';

import {PhotographerPlacesService} from '../../../../app/photographer/photographer-places/photographer-places.service';

describe('PhotographerPlacesService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      PhotographerPlacesService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions):Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('test getPhotographers()', fakeAsync(inject([PhotographerPlacesService, MockBackend],
    (photographerPlacesService:PhotographerPlacesService, mockBackend:MockBackend) => {
      let res;
      mockBackend.connections.subscribe((connection:any) => {
        expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/photographer-places?id=56ec091caf72e9437cbccfab`);
        let response = new ResponseOptions({
          body: `{"success":true,"msg":[],"data":{"countries":[{"name":"India","region":"Asia","places":
        [{"image":"http://static.dollarstreet.org.s3.amazonaws.com/media/India 2/image/62f004cd-0ede-4a2c-bd57-6b8f4815baba/thumb-62f004cd-0ede-4a2c-bd57-6b8f4815baba.jpg",
        "family":"Ramachandran","placeId":"54b51b835edc101155fa1ed2","income":100,"imageId":"54b51ba75edc101155fa1ed7","thing":"546ccf730f7ddf45c017962f"},
        {"image":"http://static.dollarstreet.org.s3.amazonaws.com/media/India 1/image/db6192ba-963f-48ba-ae73-1ece7c505109/thumb-db6192ba-963f-48ba-ae73-1ece7c505109.jpg",
        "family":"Ganesh","placeId":"54b51a173755cbfb542c2473","income":96,"imageId":"54b51a573755cbfb542c247a","thing":"546ccf730f7ddf45c017962f"},
        {"image":"http://static.dollarstreet.org.s3.amazonaws.com/media/India 3/image/42beb78b-0e1c-405f-9dc4-64c478de51aa/thumb-42beb78b-0e1c-405f-9dc4-64c478de51aa.jpg",
        "family":"Abdul Kadhar","placeId":"54b51c593755cbfb542c24a5","income":145,"imageId":"54b51c8105df73e55431911b","thing":"546ccf730f7ddf45c017962f"},
        {"image":"http://static.dollarstreet.org.s3.amazonaws.com/media/India 4/image/2d763a64-285b-4bd7-862e-cc1d3cb25132/thumb-2d763a64-285b-4bd7-862e-cc1d3cb25132.jpg",
        "family":"Gada","placeId":"54b520ed05df73e55431912b","income":96,"imageId":"54b5213d38ef07015525f1bd","thing":"546ccf730f7ddf45c017962f"}]}],
        "familyThingId":"546ccf730f7ddf45c017962f"},"error":false}`
        });
        connection.mockRespond(new Response(response));
      });
      photographerPlacesService.getPhotographerPlaces('id=56ec091caf72e9437cbccfab').subscribe((_res:any) => {
        res = _res;
      });
      tick();
      expect(!res.err).toBe(true);
      expect(res.data.countries.length).toBe(1);
      expect(res.data.countries[0].places.length).toBe(4);
    })));
});

