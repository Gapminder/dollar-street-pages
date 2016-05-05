import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class PhotographersService {
  public http:Http;

  constructor(@Inject(Http) http) {
    this.http = http;
  }

  public getPhotographers(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/photographers`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
