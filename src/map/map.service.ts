import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

@Injectable()
export class MapService {
  public http: any;

  public constructor(@Inject(Http) http: any) {
    this.http = http;
  }

  public getMainPlaces(query: any): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/map?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
