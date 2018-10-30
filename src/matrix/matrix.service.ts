import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import { DefaultUrlParameters } from '../defaultState';
import { UrlParametersService } from '../url-parameters/url-parameters.service';
import { Subject } from 'rxjs/Subject';
import { Place } from '../interfaces';


@Injectable()
export class MatrixService {
  hoverPlace = new Subject();

  constructor(
    private http: Http,
    private urlParamenterService: UrlParametersService) {
  }

  setHoverPlaces(place: Place): void {
    this.hoverPlace.next(place);
  }

  savePinnedPlaces(query: string): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/save-pinned-places?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  getPinnedPlaces(query: string): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/get-pinned-places?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  getMatrixImages(query: string): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/things?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      if (!parseRes.success) {
        this.urlParamenterService.dispatchToStore(DefaultUrlParameters);
      }

      return {err: parseRes.error, data: parseRes.data};
    });
  }

  getCurrencyUnits(): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/get-exchange-data`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }
}
