import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Config} from '../../app.config';

export class FamilyInfoService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getFamilyInfo(query:any):Observable<any> {
    return this.http.get(`${Config.api}/consumer/api/v1/matrix/matrix-view-block/images?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      console.log('DATA FAMILY SERVE', parseRes.data);
      return {err: parseRes.error, images: parseRes.data};
    });
  }
}
