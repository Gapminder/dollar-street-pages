import { it, describe, tick, inject, fakeAsync, addProviders } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { aboutContext } from './mocks/data';
import { Config } from '../../../app/app.config.ts';
import { ArticleService } from '../../../app/article/article.service';

describe('ArticleService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      ArticleService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getArticle()', fakeAsync(inject([ArticleService, MockBackend],
    (articleService: ArticleService, mockBackend: MockBackend) => {
      let res: any;
      let context: any = aboutContext.data;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/article?id=546ccf730f7ddf45c017962f`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":${JSON.stringify(context)},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      articleService.getArticle('id=546ccf730f7ddf45c017962f').subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data._id).toEqual(context._id);
      expect(res.data.description).toEqual(context.description);
      expect(res.data.shortDescription).toEqual(context.shortDescription);
      expect(res.data.thing).toEqual(context.thing);
    })));
});
