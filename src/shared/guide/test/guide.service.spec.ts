import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';
import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    XHRBackend,
    HttpModule
} from '@angular/http';
import { GuideService } from '../guide.service';

describe('GuideService', () => {
    let mockBackend: MockBackend;
    let guideService: GuideService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                GuideService,
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

        const testBed = getTestBed();
        mockBackend = testBed.get(MockBackend);
        guideService = testBed.get(GuideService);
    }));

    it('getGuide()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        let context = `[
        {
            "_id":"57835fbd4f8d95cb1f62c71e",
            "name":"image",
            "header":"Money is not everything!",
            "description":"Click the photos to learn more about the families and their dreams.",
            "link":{"text":"","href":""}
        },
        {
            "_id":"57835fbd4f8d95cb1f62c71a",
            "name":"thing",
            "header":"The things we all have in common",
            "description":"Everyone needs to eat, sleep and pee. We all have the same needs, but we can afford different solutions. Select from 100 topics. The everyday life looks surprisingly similar for people on the same income level across cultures and continents.",
            "link":{}
        },
        {
            "_id":"57835fbd4f8d95cb1f62c71c",
            "name":"income",
            "header":"To compare homes on similar incomes",
            "description":"move these sliders to focus on a certain part of the street.",
            "link":{}
        },
        {
            "_id":"57835fbd4f8d95cb1f62c71f",
            "name":"welcomeHeader",
            "header":"",
            "description":"<p>In the news people in other cultures seem stranger than they are.</p>\n<p>We visited 264 families in 50&nbsp;countries and collected 30,000 photos.</p>\n<p>We sorted the homes by income, from left to right.</p>",
            "link":{}
        },
        {
            "_id":"57835fbd4f8d95cb1f62c71d",
            "name":"street",
            "header":"Everyones lives on Dollar Street","description":"Your house number shows your income per month. Most people live somewhere between the richest and the poorest.",
            "link":{}
        },
        {
            "_id":"57835fbd4f8d95cb1f62c71b",
            "name":"geography",
            "header":"In the same country, people can have very different incomes.",
            "description":"Select countries and regions to compare homes from the same part of the world.",
            "link":{}
        }]`;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/onboarding?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data": ${JSON.stringify(context)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        guideService.getGuide(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(context);
    }));
});