import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';
import { UrlChangeService } from '../../common';

@Injectable()
export class LanguageService {
  public http: Http;
  public location: Location;
  public window: Window = window;
  public currentLanguage: string;
  public urlChangeService: UrlChangeService;

  public constructor(@Inject(Http) http: Http,
                     @Inject(Location) location: Location,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService) {
    this.http = http;
    this.location = location;
    this.urlChangeService = urlChangeService;
  }

  public getLanguage(query: string): Observable<any> {
    return this.http.get(`${Config.api}/v1/language?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }

  public getLanguagesList(): Observable<any> {
    return this.http.get(`${Config.api}/v1/languagesList`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }

  public getLanguageParam(): string {
    return `&lang=${this.currentLanguage}`;
  }

  public updateLangUrl(currentLanguage: string): void {
    this.currentLanguage = currentLanguage;

    const currentUrl: string = this.location.path();

    const pathAndQueryParams: string[] = currentUrl.split('?');
    const queryParamsString: string = pathAndQueryParams[1];

    const path: string = pathAndQueryParams[0];
    const queryParams: any = queryParamsString ? Config.parseUrl(queryParamsString) : {};

    queryParams.lang = this.currentLanguage;

    this.urlChangeService.replaceState(path, Config.objToQuery(queryParams), true);
  }
}
