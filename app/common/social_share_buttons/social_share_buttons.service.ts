import {Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from "rxjs/Observable";

export class SocialShareButtonsService {

  public http:Http;
  
  constructor(@Inject(Http) http:Http) {
    this.http = http;
  }

  public getUrl(query:any):Observable<any> {
    return this.http.get(`http://localhost/consumer/api/v1/shorturl?${query}`).map((res:any)=>{
      let parseRes=JSON.parse(res._body);
      return {err:parseRes.error, url:parseRes.data}
    })
  }
}
