/**
 * Created by igor on 2/15/16.
 */
import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";

export class MatrixService {
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getMatrixImages(query:string):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/things?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error,places:parseRes.data}
    })
  }
}
