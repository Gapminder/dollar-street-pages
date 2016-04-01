import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class CountryPlacesService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getCountryPlaces(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/country-places?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
