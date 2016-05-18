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
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions):Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('getThingsByRegion', fakeAsync(inject([PlaceStreetService, MockBackend],
    (placeStreetService:PlaceStreetService, mockBackend:MockBackend) => {
      let res;
      mockBackend.connections.subscribe((connection:any) => {
        expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/slider/things?isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`);
        let response = new ResponseOptions({
          body: streetPlaceStr
        });
        connection.mockRespond(new Response(response));
      });
      placeStreetService.getThingsByRegion(`isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`).subscribe((_res:any) => {
        res = _res;
      });
      tick();
      expect(!res.err).toBe(true);
      expect(res.data.places.length).toBe(203);
    })));
});
