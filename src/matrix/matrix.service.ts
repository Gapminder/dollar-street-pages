import { Inject, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class MatrixService {
  public http: Http;

  public constructor(@Inject(Http) http: Http) {
    this.http = http;
  }

  public uploadScreenshot(data: any): Promise<any> {
    return this.http.post(`${environment.consumerApi}/v1/upload-screenshot`, data).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  public savePinnedPlaces(query: string): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/save-pinned-places?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  public getPinnedPlaces(query: string): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/get-pinned-places?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  public removeTempImages(query: string): Promise<any> {
    return this.http.get(`${environment.consumerApi}/v1/remove-temp-images?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    }).toPromise();
  }

  public getMatrixImages(query: string): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/things?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
