import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class ThingsMainService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getMainThings(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/main/things`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, things: parseRes.data};
    });
  }
}
