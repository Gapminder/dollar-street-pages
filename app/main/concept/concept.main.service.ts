import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {config} from '../../app.config';

export class ConceptMainService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getMainConceptThings(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/main/things`, query).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, things: parseRes.data};
    });
  }

  public getMainConceptImages(query:any):Observable<any> {
    return this.http.get(`${config.api}/consumer/api/v1/main/images/${query.thingId}`).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, images: parseRes.data};
    });
  }
}
