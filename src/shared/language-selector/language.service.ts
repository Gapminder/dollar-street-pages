import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';
import { UrlChangeService } from '../../common';

@Injectable()
export class LanguageService {
  public http: Http;
  public urlChangeService: UrlChangeService;
  public currentLanguage: string;

  public constructor(@Inject(Http) http: Http,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService) {
    this.http = http;
    this.urlChangeService = urlChangeService;
  }

  public getLanguage(query: string): Observable<any> {
    return this.http.get(`${Config.api}/v1/language?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }

  public setCurrentLanguage(value: string): void {
    this.currentLanguage = value;

    this.updateLangUrl();
  }

  public updateLangUrl(): void {
    let currentSearch = window.location.search;
    let newSearch = currentSearch.replace(/language\=\w*/, `language=${this.currentLanguage}`);

    let paths = [];

    let pathName = window.location.pathname;

    for (let i = pathName.length; i >= 0; i --) {
      if(pathName[i] === '/') {
        paths.unshift(pathName.slice(i, pathName.length));
      }
    }

    let path = paths[1];

    let language = this.urlChangeService.getUrlParams('language');

    if(language === '') {
      let search: string = currentSearch === '' ? currentSearch + `language=${this.currentLanguage}` : currentSearch + `&language=${this.currentLanguage}`;

      this.urlChangeService.replaceState(path, search);
    } else {
      this.urlChangeService.replaceState(path, newSearch);
    }
  }

  public getLanguageParam(): string {
    return `&language=${this.currentLanguage}`;
  }

  public getLanguagesList(): Observable<any> {
    return this.http.get(`${Config.api}/v1/languagesList`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }
}
