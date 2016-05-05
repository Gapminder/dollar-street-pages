import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../app.config';

export class PlaceStreetService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getThingsByRegion(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/slider/things?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }

  public getCommonAboutData():Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/about-data`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
