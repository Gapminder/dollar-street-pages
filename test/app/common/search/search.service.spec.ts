import {
  it,
  describe,
  xdescribe,
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
import {initData} from './mocks/data';
import {SearchService} from '../../../../app/common/search/search.service';

describe('SearchService', () => {
  beforeEachProviders(() => {
    return [
      BaseRequestOptions,
      MockBackend,
      SearchService,
      provide(
        Http, {
          useFactory: (backend:ConnectionBackend, defaultOptions:BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ];
  });
  it('getSearchInitData()', inject([SearchService, MockBackend],
    fakeAsync((searchService, mockBackend) => {
      var res;
      mockBackend.connections.subscribe(connection => {
        expect(connection.request.url).toBe(`${config.api}/consumer/api/v1/search?thing=5477537786deda0b00d43be5&place=54b6866a38ef07015525f5be&image=54b6862f3755cbfb542c28cb`);
        /**
         * ToDo: change body of response
         * @type {ResponseOptions}
         */
        let response = new ResponseOptions({
          body: JSON.stringify(initData)});
          connection.mockRespond(new Response(response));
      });
      searchService.getSearchInitData('thing=5477537786deda0b00d43be5&place=54b6866a38ef07015525f5be&image=54b6862f3755cbfb542c28cb').subscribe((_res) => {
        res = _res;
      });
      tick();
      expect(res.err).toBe(null);
      expect(res.data.categories.length).toBe(27);
      expect(res.data.countries.length).toBe(43);
    })));
});
