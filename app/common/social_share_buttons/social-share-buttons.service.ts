import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';

export class SocialShareButtonsService {
  public http:Http;

  public constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getUrl(query:any):Observable<any> {
    return this.http.post(`${Config.api}/consumer/api/v1/shorturl`, query).map((res:any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, url: parseRes.data};
    });
  }
}
