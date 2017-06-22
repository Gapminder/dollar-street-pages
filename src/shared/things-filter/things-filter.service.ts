import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class ThingsFilterService {
  public http: any;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getThings(query: string): Observable<any> {console.log('THINGS FILTER CALL');
    return this.http
      .get(`${environment.consumerApi}/v1/things-filter?${query}`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);
        return {err: parseRes.error, data: parseRes.data};
      });
  }
}
