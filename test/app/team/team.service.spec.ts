import { it, describe, tick, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { Config } from '../../../app/app.config.ts';
import { TeamService } from '../../../app/team/team.service';
import { addProviders } from '@angular/core/testing/testing';
import { team } from './mocks/data.ts';

describe('TeamService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      TeamService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getTeam()', fakeAsync(inject([TeamService, MockBackend],
    (infoContextService: TeamService, mockBackend: MockBackend) => {
      let res;
      let context = team.data;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/team`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":${JSON.stringify(context)},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      infoContextService.getTeam().subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data.length).toEqual(3);
    })));
});
