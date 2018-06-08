import { it, describe, tick, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { Config } from '../../../src/app.config';
import { AboutService } from '../../../src/about/about.service';
import { addProviders } from '@angular/core/testing/testing';

describe('AboutService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      AboutService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getInfo()', fakeAsync(inject([AboutService, MockBackend],
    (infoContextService: AboutService, mockBackend: MockBackend) => {
      let res;
      let context = '<p>&nbsp;</p>\n<h1 style=\"text-align: center;\">Welcome in Dollar Street project!</h1>\n<p style=\"text-align: center;\">In future here will be info about data of this project.</p>\n<p style=\"text-align: center;\"><br /><img src2=\"http://www.web-and-art.com/wp-content/uploads/2015/05/dollar-street-4.png\" alt=\"test\" width=\"1200\" height=\"600\" /></p>\n<p style=\"text-align: center;\">&nbsp;</p>\n<p style=\"text-align: center;\">Some text about the data&nbsp;Some text about the data&nbsp;Some text about the data</p>\n<p style=\"text-align: center;\">&nbsp;</p>';

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/info`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":{"_id":"572b2f133d4756bc524125ff",
              "context": ${JSON.stringify(context)}},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      infoContextService.getInfo().subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data._id).toEqual('572b2f133d4756bc524125ff');
      expect(res.data.context).toEqual(context);
    })));
});
