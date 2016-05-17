import {
  it,
  describe,
  beforeEachProviders,
  tick,
  inject,
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

import {config} from '../../../../app/app.config.ts';

import {PhotographersService} from '../../../../app/all-photographers/photographers/photographers.service.ts';

describe('PhotographersService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      PhotographersService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions):Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('test getPhotographers()', fakeAsync(inject([PhotographersService, MockBackend],
    (photographersService:PhotographersService, mockBackend:MockBackend) => {
      let res;
      mockBackend.connections.subscribe((connection:any) => {
        expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/photographers`);
        let response = new ResponseOptions({
          body: `{"success":true,"msg":[],"data":{
  "countryList":[{"name":"Bangladesh","photographers":[{"name":"AJ Sharma","userId":"56e946c4d360263447ff6fad","images":289,"places":4}]}],
  "photographersList":[{"name":"AJ Sharma","userId":"56e946c4d360263447ff6fad","images":289,"places":4}]
  },"error":false}`
        });
        connection.mockRespond(new Response(response));
      });
      photographersService.getPhotographers().subscribe((_res:any) => {
        res = _res;
      });
      tick();
      expect(!res.err).toBe(true);
      expect(res.data.countryList.length).toBe(1);
      expect(res.data.photographersList.length).toBe(1);
    })));
});

