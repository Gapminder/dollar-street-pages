import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class ArticleService {
  public constructor(private http: Http) {
  }

  public getArticle(query: string): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/article?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
