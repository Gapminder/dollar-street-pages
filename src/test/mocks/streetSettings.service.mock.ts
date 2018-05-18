import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StreetSettingsServiceMock {
  public getStreetSettings(): Observable<any> {
    let context: any = {
      _id: '57963211cc4aaed63a02504c',
      showDividers: false,
      low: 30,
      medium: 300,
      high: 3000,
      poor: 26,
      rich: 15000,
      lowDividerCoord: 78,
      mediumDividerCoord: 490,
      highDividerCoord: 920,
      __v: 0,
      dividers: [30, 300, 3000]
    };
    let response: any = {success: true, error: false, msg: [], data: context};

    return Observable.of(response);
  }
}
