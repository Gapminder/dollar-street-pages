import { it, describe, tick, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { Config } from '../../../../app/app.config.ts';
import { FooterService } from '../../../../app/common/footer/footer.service';
import { addProviders } from '@angular/core/testing/testing';
import { footerInfo } from './mocks/data';

describe('FooterService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      FooterService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getFooter()', fakeAsync(inject([FooterService, MockBackend],
    (footerService: FooterService, mockBackend: MockBackend) => {
      let res;
      let context = footerInfo.data.text;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/footer-text`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":{"_id":"578360844e9654562024a13f",
              "text": ${JSON.stringify(context)}},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      footerService.getFooter().subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data._id).toEqual('578360844e9654562024a13f');
      expect(res.data.text).toEqual(context);
    })));
});
