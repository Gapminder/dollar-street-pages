import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";

export class SliderMobilePlaceService{
  public http:Http;

  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getPlaceSliderImages(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/place/slider/images?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, images:parseRes.data}
    })
  }

  public getPlaceSliderFamily(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/place/slider/family?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, data:parseRes.data}
    })
  }

  public getThingsByRegion(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/slider/things?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, data: parseRes.data}
    })
  }
}
