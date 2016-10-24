import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Config } from '../../app.config';

export interface DrawDividersInterface {
  showDividers: boolean;
  low: number;
  medium: number;
  high: number;
  poor: number;
  rich: number;
  lowDividerCoord: number;
  mediumDividerCoord: number;
  highDividerCoord: number;
}

let _cache: Observable<any>;

@Injectable()
export class StreetSettingsService {
  public http: Http;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public getStreetSettings(): Observable<any> {
    if (_cache) {
      return _cache;
    }
    _cache = this.http
      .get(`${Config.api}/consumer/api/v1/street-settings`)
      .map((res: any) => {
        let parseRes = JSON.parse(res._body);
        return {err: parseRes.error, data: parseRes.data as DrawDividersInterface};
      })
      .share();
    return _cache;
  }
}
