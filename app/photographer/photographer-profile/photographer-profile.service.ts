import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class PhotographerProfileService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getPhotographerProfile(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/photographer-profile?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
