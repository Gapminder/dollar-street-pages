import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Config} from '../../app.config';

export class MainPlacesService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getMainPlaces():Observable<any> {
    return this.http.get(`${Config.api}/consumer/api/v1/public/places`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, places: parseRes.data};
    });
  }
}
