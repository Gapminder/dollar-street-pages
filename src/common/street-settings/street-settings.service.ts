import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../../environments/environment';
import { DrawDividersInterface } from '../../interfaces';

let _cache: Observable<any>;

@Injectable()
export class StreetSettingsService {
  public constructor(private http: Http) {
  }

  public getStreetSettings(): Observable<any> {
    if (_cache) {
      return _cache;
    }
    _cache = this.http
      .get(`${environment.consumerApi}/v1/street-settings`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);
        return {err: parseRes.error, data: parseRes.data as DrawDividersInterface};
      })
      .share();
    return _cache;
  }
}
