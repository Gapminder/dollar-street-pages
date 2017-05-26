import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app.config';
import { Subscription } from 'rxjs/Subscription';
import { UrlChangeService } from '../../common';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class LanguageService {
  public http: Http;
  public location: Location;
  public window: Window = window;
  public currentLanguage: string;
  public urlChangeService: UrlChangeService;
  public translate: TranslateService;
  public translateSubscribe: Subscription;
  public translations: any;
  public translationsReceivedEvent: EventEmitter<any> = new EventEmitter<any>();
  public onLangChangeSubscribe: Subscription;

  public constructor(@Inject(Http) http: Http,
                     @Inject(Location) location: Location,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService,
                     @Inject(TranslateService) translate: TranslateService) {
    this.http = http;
    this.location = location;
    this.urlChangeService = urlChangeService;
    this.translate = translate;

    if (this.onLangChangeSubscribe) {
      this.onLangChangeSubscribe.unsubscribe();
    }

    this.onLangChangeSubscribe = this.translate.onLangChange
      .subscribe((data: any) => {
        this.translations = data.translations;

        this.translationsReceivedEvent.emit(this.translations);
    });
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

  public getTranslatedDescription(callback: Function): void {
    this.translateSubscribe = this.translate.get(['SEE_HOW_PEOPLE', 'REALLY', 'LIVE']).subscribe((res: any) => {
      callback(res.SEE_HOW_PEOPLE+' '+res.REALLY+' '+res.LIVE);
    });

    if(this.translateSubscribe) {
      this.translateSubscribe.unsubscribe();
    }
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
