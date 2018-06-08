import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class FamilyMediaService {
  public constructor(private http: Http) {
  }

  public getFamilyMedia(query: any): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/home-media?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
