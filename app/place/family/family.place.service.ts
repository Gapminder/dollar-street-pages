import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";

export class FamilyPlaceService{
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getPlaceFamilyImages(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/place/family/images?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, images:parseRes.data}
    })
  }

  public getPlaceFamilyThings(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/place/family/things`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, things:parseRes.data}
    })
  }
}
