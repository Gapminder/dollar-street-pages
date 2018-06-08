import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class PhotographerProfileService {
  public constructor(private http: Http) {
  }

  public getPhotographerProfile(query: any): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/photographer-profile?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
