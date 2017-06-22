import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class CountriesFilterService {
  public http: any;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getCountries(query: string): Observable<any> {console.log('COUNTIES FILTER CALL');
    return this.http
      .get(`${environment.consumerApi}/v1/countries-filter?${query}`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);

        return {err: parseRes.error, data: parseRes.data};
      });
  }
}
