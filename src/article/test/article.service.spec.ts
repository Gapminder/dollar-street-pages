import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    MockBackend
} from '@angular/http/testing';

import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    XHRBackend,
    HttpModule
} from '@angular/http';

import { ArticleService } from '../article.service';

import { aboutContext } from './mock.data';

describe('ArticleService', () => {
    let mockBackend: MockBackend;
    let articleService: ArticleService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ArticleService,
                MockBackend,
                BaseRequestOptions,
                {
                    deps: [
                        MockBackend,
                        BaseRequestOptions
                    ],
                    provide: Http,
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });

        TestBed.compileComponents();

        const testBed = getTestBed();
        mockBackend = testBed.get(MockBackend);
        articleService = testBed.get(ArticleService);
    }));

    it('getArticle()', fakeAsync(() => {
        const query: string = '&lang=en&id=546ccf730f7ddf45c017962f';
        let response: any = void 0;
        let context: any = aboutContext.data;

        mockBackend.connections.subscribe((connection: any) => {
            expect(connection.request.url.indexOf(`/v1/article?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"error":null,"msg":[],"data":${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        articleService.getArticle(query).subscribe((data: any) => {
            response = data;
        });

        tick();

        expect(!response.error).toBe(true);
        expect(response.data._id).toEqual(context._id);
        expect(response.data.description).toEqual(context.description);
        expect(response.data.shortDescription).toEqual(context.shortDescription);
        expect(response.data.thing).toEqual(context.thing);
    }));
});
