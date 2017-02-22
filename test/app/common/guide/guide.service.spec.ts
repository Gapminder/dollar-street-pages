import { it, describe, tick, inject, fakeAsync, addProviders } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { guideContext } from './mocks/data';
import { Config } from '../../../../src/app.config';
import { GuideService } from '../../../../src/shared/guide/guide.service';

describe('ArticleService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      GuideService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getGuide()', fakeAsync(inject([GuideService, MockBackend],
    (guideService: GuideService, mockBackend: MockBackend) => {
      let res: any;
      let context: any = guideContext.data;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/onboarding`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":${JSON.stringify(context)},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      guideService.getGuide().subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data.length).toEqual(6);
    })));
});
