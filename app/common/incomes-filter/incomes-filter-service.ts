import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';

export class StreetSettingsService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getStreetSettings():Observable<any> {
    return this.http.get(`${Config.api}/consumer/api/v1/street-settings`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      let data = parseRes.data[0];
      if (data) {
        return {err: parseRes.error, data: data};
      }
      return {err: parseRes.error};
    });
  }
}
