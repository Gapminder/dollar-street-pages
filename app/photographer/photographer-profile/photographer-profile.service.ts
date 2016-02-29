import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";

export class PhotographerProfileService{
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getPhotographer(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/photographer`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, photographer:parseRes.data}
    })
  }
}
