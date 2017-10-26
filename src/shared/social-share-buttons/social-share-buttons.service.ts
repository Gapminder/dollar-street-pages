import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class SocialShareButtonsService {
  public constructor(private http: Http) {
  }

  public getUrl(query: any): Observable<any> {
    return this.http.post(`${environment.consumerApi}/v1/shorturl`, query).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, url: parseRes.data};
    });
  }
}
