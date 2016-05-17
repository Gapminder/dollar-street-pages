import {Inject} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class FamilyPlaceService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getPlaceFamilyImages(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/place/family/images?${query}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, images: parseRes.data};
    });
  }
}
