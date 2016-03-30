import {
  it,
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

import {config} from '../../../app/app.config.ts';

import {PhotographersService} from '../../../app/all-photographers/photographers/photographers.service.ts';

describe('PhotographersService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      PhotographersService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]
  });
  it('test getPhotographers()', inject([PhotographersService, MockBackend], fakeAsync((photographersService,
                                                                                       mockBackend) => {
    var res;
    mockBackend.connections.subscribe(connection => {
      expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/photographers`);
      let response = new ResponseOptions({
        body: `{"success":true,"msg":[],"data":{
  "countryList":[{"name":"Bangladesh","photographers":[{"name":"AJ Sharma","userId":"56e946c4d360263447ff6fad",
  "avatar":null,"images":289,"places":4}]}],
  "photographersList":[{"name":"AJ Sharma","userId":"56e946c4d360263447ff6fad","avatar":null,"images":289,"places":4}]
  },"error":null}`
      });
      connection.mockRespond(new Response(response));
    });
    photographersService.getPhotographers({}).subscribe((_res) => {
      res = _res;
    });
    tick();
    expect(res.err).toBe(null);
    expect(res.data.countryList.length).toBe(1);
    expect(res.data.photographersList.length).toBe(1);
  })));
});

