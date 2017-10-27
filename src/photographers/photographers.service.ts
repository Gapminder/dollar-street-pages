import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

@Injectable()
export class PhotographersService {
  public constructor(private http: Http) {
  }

  public getPhotographers(query: any): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/photographers?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
