import {
  it,
  expect,
  describe,
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

import {config} from '../../../app/app.config.ts';

import {PlaceStreetService} from '../../../app/place/place-street.service';

import {streetPlaceStr} from './mocks/data.ts';

describe('PlaceStreetService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      PlaceStreetService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('getThingsByRegion', inject([PlaceStreetService, MockBackend], fakeAsync((placeStreetService,
                                                                                    mockBackend) => {
    var res;
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/slider/things?isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`);
      let response = new ResponseOptions({
        body: streetPlaceStr
      });
      connection.mockRespond(new Response(response));
    });
    placeStreetService.getThingsByRegion(`isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`).subscribe((_res) => {
      res = _res;
    });
    tick();
    expect(res.err).toBe(null);
    expect(res.data.places.length).toBe(203);
  })));
});
