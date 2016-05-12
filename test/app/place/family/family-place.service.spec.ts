import {
  it,
  expect,
  describe,
  xdescribe,
  inject,
  fakeAsync,
  beforeEachProviders,
  tick,
} from 'angular2/testing';

import {MockBackend} from 'angular2/http/testing';
import {provide} from 'angular2/core';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions
} from 'angular2/http';

import {config} from '../../../../app/app.config.ts';

import {FamilyPlaceService} from '../../../../app/place/family/family-place.service';

import {jsonPlaces} from '../mocks/data.ts';

describe('FamilyPlaceService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      FamilyPlaceService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('getPlaceFamilyImages()', inject([FamilyPlaceService, MockBackend], fakeAsync((familyPlaceService,
                                                                                    mockBackend) => {
    var res;
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/place/family/images?isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`);
      let response = new ResponseOptions({
        body: jsonPlaces
      });
      connection.mockRespond(new Response(response));
    });
    familyPlaceService.getPlaceFamilyImages(`isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`).subscribe((_res) => {
      res = _res;
    });
    tick();
    expect(res.err).toBe(null);
    expect(res.images.length).toBe(2);
  })));
});
