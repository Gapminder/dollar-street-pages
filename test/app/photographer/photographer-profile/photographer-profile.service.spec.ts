import {
  it,
  xit,
  describe,
  expect,
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

import {PhotographerProfileService} from '../../../../app/photographer/photographer-profile/photographer-profile.service';

describe('PhotographersService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      PhotographerProfileService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('test getPhotographers()', inject([PhotographerProfileService, MockBackend], fakeAsync((photographerProfileService,
                                                                                             mockBackend) => {
    var res;
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/photographer-profile?id=56ec091caf72e9437cbccfab`);
      let response = new ResponseOptions({
        body: `{"success":true,"msg":[],"data":{"_id":"56ec091caf72e9437cbccfab","username":"aj-sharma","lastName":"Sharma",
        "firstName":"AJ","email":"aj.sharma@dollarstreet.org","role":"photographer","__v":0,
        "avatar":"http://static.dollarstreet.org.s3.amazonaws.com/users/56ec091caf72e9437cbccfab/avatar.jpg",
        "imagesCount":289,"placesCount":4},"error":null}`
      });
      connection.mockRespond(new Response(response));
    });
    photographerProfileService.getPhotographerProfile('id=56ec091caf72e9437cbccfab').subscribe((_res) => {
      res = _res;
    });
    tick();
    expect(res.err).toBe(null);
    expect(res.data.imagesCount).toBe(289);
    expect(res.data.placesCount).toBe(4);
  })));
});
