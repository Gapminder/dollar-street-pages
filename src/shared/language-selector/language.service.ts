import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';
import { UrlChangeService } from '../../common';

@Injectable()
export class LanguageService {
  public location: Location;
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

    let search: string = '';

    if(language === '') {
      search = currentSearch === '' ? currentSearch + `language=${this.currentLanguage}` : currentSearch + `&language=${this.currentLanguage}`;
    } else {
      search = newSearch;
    }

    this.location.replaceState(path, search);
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
