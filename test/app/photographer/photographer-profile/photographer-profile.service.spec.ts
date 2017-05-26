import { it, describe, inject, fakeAsync, tick, addProviders } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { Config } from '../../../../src/app.config';
import { PhotographerProfileService } from '../../../../src/photographer/photographer-profile/photographer-profile.service';

describe('PhotographersService', () => {
  beforeEach(() => {
    addProviders([
      BaseRequestOptions,
      MockBackend,
      PhotographerProfileService,
      provide(
        Http, {
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions): Http => {
            return new Http(backend, defaultOptions);
          }, deps: [MockBackend, BaseRequestOptions]
        })
    ]);
  });

  it('test getPhotographers()', fakeAsync(inject([PhotographerProfileService, MockBackend],
    (photographerProfileService: PhotographerProfileService, mockBackend: MockBackend) => {
      let res;

      mockBackend.connections.subscribe((connection: any) => {
        expect(connection.request.url).toBe(`${Config.api}/consumer/api/v1/photographer-profile?id=56ec091caf72e9437cbccfab`);

        let response = new ResponseOptions({
          body: `{'success':true,'msg':[],'data':{'_id':'56ec091caf72e9437cbccfab','username':'aj-sharma','lastName':'Sharma',
        'firstName':'AJ','email':'aj.sharma@dollarstreet.org','role':'photographer','__v':0,
        'avatar':'http://static.dollarstreet.org.s3.amazonaws.com/users/56ec091caf72e9437cbccfab/avatar.jpg',
        'imagesCount':289,'placesCount':4},'error':false}`
        });

        connection.mockRespond(new Response(response));
      });

      photographerProfileService.getPhotographerProfile('id=56ec091caf72e9437cbccfab').subscribe((_res: any) => {
        res = _res;
      });

      tick();

      expect(!res.err).toBe(true);
      expect(res.data.imagesCount).toBe(289);
      expect(res.data.placesCount).toBe(4);
    })));
});
