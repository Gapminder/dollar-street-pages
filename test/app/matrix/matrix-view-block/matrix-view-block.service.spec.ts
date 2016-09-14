import { it, describe, tick, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { Config } from '../../../../app/app.config.ts';
import { FamilyInfoService } from '../../../../app/matrix/matrix-view-block/matrix-view-block.service';
import { addProviders } from '@angular/core/testing/testing';
import { blockData } from './mocks/data';

describe('AboutService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      FamilyInfoService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getFamilyInfo()', fakeAsync(inject([FamilyInfoService, MockBackend],
    (familyInfoService: FamilyInfoService, mockBackend: MockBackend) => {
      let res;
      let context = blockData.data;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/matrix-view-block/?placeId=547c4bc9b787bd0b00dcfb5b&thingId=Families`);

        let response = new ResponseOptions({
          body: `{"success":"true","msg":[],"data":${JSON.stringify(context)},"error":"false"}`
        });

        connection.mockRespond(new Response(response));
      });

      familyInfoService.getFamilyInfo('placeId=547c4bc9b787bd0b00dcfb5b&thingId=Families').subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.error).toBe(true);
      expect(res.data.familyData).toEqual(context.familyData);
      expect(res.data.familyName).toEqual(context.familyName);
    })));
});
