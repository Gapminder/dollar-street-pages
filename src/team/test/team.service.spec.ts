import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
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
import { TeamService } from '../team.service';

describe('PhotographersService', () => {
    let mockBackend: MockBackend;
    let teamService: TeamService;

    const teamData = [{"_id":"57f77646ed59e7b462c60a70","ambassadors":[{"name":"Anna Rosling Rönnlund","country":"Sweden","description":"Mother of Dollar Street","avatar":"//static.dollarstreet.org/users/57b48db5e19579cd5db8bc86/avatar.jpg","company":{"name":"Gapminder Foundation"},"priority":1,"originName":"Anna Rosling Rönnlund"},{"name":"Ola Rosling","country":"Sweden","description":"President of Gapminder","avatar":"//static.dollarstreet.org/users/57b49513e19579cd5db8bc87/avatar.jpg","company":{"name":"Gapminder Foundation"},"priority":2,"originName":"Ola Rosling"},{"name":"Fernanda Drumond","country":"Brazil","description":"Project Manager","avatar":"//static.dollarstreet.org/users/57b48e5a86b821975d2eab8a/avatar.jpg","company":{"name":"Gapminder Foundation"},"priority":3,"originName":"Fernanda Drumond"}],"name":"Core team","originTypeName":"Core team","position":4},{"_id":"57f77646ed59e7b462c60a6f","ambassadors":[{"name":"Harald Hultqvist","country":"Sweden","avatar":"//static.dollarstreet.org/users/57c97a48e14b63c55669ba31/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Harald Hultqvist"},{"name":"Hisham Najam","country":"Pakistan","description":"Data and Texts","avatar":"//static.dollarstreet.org/users/57c70b62e2a9adaa56d31d18/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Hisham Najam"},{"name":"Anna Ander","country":"Sweden","description":"Communications","avatar":"//static.dollarstreet.org/users/579740b5e1d6aaa93b97aa1e/avatar.jpg","priority":0,"originName":"Anna Ander"},{"name":"Ocean Observations","country":"Sweden","description":"Usability","avatar":"//static.dollarstreet.org/users/57973eae3b9f5bd23bfb4fe6/avatar.jpg","priority":0,"originName":"Ocean Observations"},{"name":"Magnus Höglund","country":"Sweden","description":"Technical Advisor","avatar":"//static.dollarstreet.org/users/565c656bdd8d2df15650a9eb/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Magnus Höglund"},{"name":"Mattias Lindgren","country":"Sweden","description":"Data Guy","avatar":"//static.dollarstreet.org/users/57c98f5ee14b63c55669ba32/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Mattias Lindgren"},{"name":"Mikael Arevius","country":"Sweden","description":"Teaching material","avatar":"//static.dollarstreet.org/users/57974318e1d6aaa93b97aa1f/avatar.jpg","priority":0,"originName":"Mikael Arevius"},{"name":"Olof Granström","country":"Sweden","description":"Teaching material","avatar":"//static.dollarstreet.org/users/579744174640f6733bb420e7/avatar.jpg","priority":0,"originName":"Olof Granström"},{"name":"Martha Nicholson","country":"United Kingdom","description":"Communications","avatar":"//static.dollarstreet.org/users/57973fc94e56129c3b6dd9e7/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Martha Nicholson"},{"name":"Max Orward","country":"Sweden","description":"Media Producer","avatar":"//static.dollarstreet.org/users/57c9494be2a9adaa56d31d19/avatar.jpg","company":{"name":"Gapminder"},"priority":0,"originName":"Max Orward"},{"name":"Global Data Lab","country":"Netherlands","description":"Data","avatar":"//static.dollarstreet.org/users/5797450be1d6aaa93b97aa20/avatar.jpg","priority":0,"originName":"Global Data Lab"},{"name":"Valor Software","country":"Ukraine","description":"Software","avatar":"//static.dollarstreet.org/users/57a1e21cec96c7f01bcba05e/avatar.jpg","company":{"link":"http://valor-software.com"},"priority":0,"originName":"Valor Software"}],"name":"Contributor","originTypeName":"Contributor","position":5}];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [],
            providers: [
                TeamService,
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

        mockBackend = TestBed.get(MockBackend);
        teamService = TestBed.get(TeamService);
    });

    it('getMainPlaces()', fakeAsync(() => {
        const query: string = 'lang=en';
        let response: any = void 0;

        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url.indexOf(`/v1/team?${query}`)).toBeGreaterThan(-1);

            let mockResponse = new ResponseOptions({
                body: `{"success":true,"msg":[],"data":${JSON.stringify(teamData)}}`
            });

            connection.mockRespond(new Response(mockResponse));
        });

        teamService.getTeam(query).subscribe((_data: any) => {
            response = _data;
        });

        tick();

        expect(!response.err).toBe(true);
        expect(response.data).toEqual(teamData);
    }));
});