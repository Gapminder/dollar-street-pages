import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../app.config';

export class MapService {
  public http:any;

  constructor(@Inject(Http) http) {
    this.http = http;
  }

  public getMainPlaces(query):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/map?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
