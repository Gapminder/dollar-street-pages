import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

@Injectable()
export class MapService {
  public constructor(private http: Http) {
  }

  public getMainPlaces(query: any): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/map?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
