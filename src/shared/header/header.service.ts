import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { Config } from '../../app.config';

@Injectable()
export class HeaderService {
  public http: any;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getDefaultThing(): Observable<any> {
    return this.http
      .get(`${Config.api}/consumer/api/v1/default-thing`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);
        return {err: parseRes.error, data: parseRes.data};
      });
  }

  public getPlaceHeader(query: string): Observable<any> {
    // return
    return this.http
      .get(`${Config.api}/consumer/api/v1/place-header?${query}`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);

        return {err: parseRes.error, data: parseRes.data};
      });
  }
}
