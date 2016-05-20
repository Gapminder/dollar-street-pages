import {
  it,
  describe,
  inject,
  beforeEachProviders,
  tick,
  fakeAsync
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

import {Config} from '../../../../app/app.config.ts';

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
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions):Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('getPlaceFamilyImages()', fakeAsync(inject([FamilyPlaceService, MockBackend],
    (familyPlaceService:FamilyPlaceService, mockBackend:MockBackend) => {
      let res;
      mockBackend.connections.subscribe((connection:any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/place/family/images?isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`);
        let response = new ResponseOptions({
          body: jsonPlaces
        });
        connection.mockRespond(new Response(response));
      });
      familyPlaceService.getPlaceFamilyImages(`isTrash=false&limit=10&placeId=54b6862f3755cbfb542c28cb&skip=0`)
        .subscribe((_res:any) => {
          res = _res;
        });
      tick();
      expect(!res.err).toBe(true);
      expect(res.images.length).toBe(2);
    })));
});
