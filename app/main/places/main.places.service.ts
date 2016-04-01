import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class MainPlacesService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getMainPlaces():Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/public/places`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, places: parseRes.data};
    });
  }
}
