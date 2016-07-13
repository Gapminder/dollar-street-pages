import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../app.config';

export class HomeIncomeFilterService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getData():Observable<any> {
    return this.http.get(`${Config.api}/consumer/api/v1/street-settings`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
