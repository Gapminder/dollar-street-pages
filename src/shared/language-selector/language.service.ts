import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';
import { UrlChangeService } from '../../common';

@Injectable()
export class LanguageService {
  public location: Location;
  public window: Window = window;
  public http: Http;
  public urlChangeService: UrlChangeService;
  public currentLanguage: string;

  public constructor(@Inject(Http) http: Http,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService,
                     @Inject(Location) location: Location) {
    this.http = http;
    this.urlChangeService = urlChangeService;
    this.location = location;
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

  public setCurrentLanguage(value: string): void {
    this.currentLanguage = value;

    this.updateLangUrl();
  }

  public updateLangUrl(): void {
    const currentSearch = this.window.location.search;
    const newSearch = currentSearch.replace(/lang\=\w*/, `lang=${this.currentLanguage}`);

    const path = '/' + this.window.location.pathname.split('/dollar-street/')[1];

    const language = this.urlChangeService.getUrlParamByName('lang');

    let search: string = '';

    if(!language) {
      search = !currentSearch ? currentSearch + `lang=${this.currentLanguage}` : currentSearch + `&lang=${this.currentLanguage}`;
    } else {
      search = newSearch;
    }

    this.location.replaceState(path, search);
  }
}
