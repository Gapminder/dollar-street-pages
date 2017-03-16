import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Config } from '../../app.config';
import { Subscription } from 'rxjs/Subscription';
import { UrlChangeService } from '../url-change/url-change.service';
import { LocalStorageService } from '../guide/localstorage.service';
import { TranslateService } from 'ng2-translate';
import { stringify } from '@angular/core/src/facade/lang';

@Injectable()
export class LanguageService {
  public http: Http;
  public location: Location;
  public currentLanguage: string;
  public defaultLanguage: string;
  public urlChangeService: UrlChangeService;
  public translate: TranslateService;
  public translateSubscribe: Subscription;
  public translations: any;
  public onLangChangeSubscribe: Subscription;
  public localStorageService: LocalStorageService;
  public translationsLoadedSubscribe: Subscription;
  public documentLoadedSubscription: Subscription;

  public constructor(@Inject(Http) http: Http,
                     @Inject(Location) location: Location,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService,
                     @Inject(TranslateService) translate: TranslateService,
                     @Inject(LocalStorageService) localStorageService: LocalStorageService) {
    this.http = http;
    this.location = location;
    this.urlChangeService = urlChangeService;
    this.translate = translate;
    this.localStorageService = localStorageService;

    if (this.documentLoadedSubscription) {
      this.documentLoadedSubscription.unsubscribe();
    }

    this.documentLoadedSubscription = Observable.fromEvent(document, 'DOMContentLoaded')
      .subscribe(() => {
        const htmlElement = document.getElementsByTagName('html')[0];
        let elementAttribute = htmlElement.attributes.getNamedItem('lang');
        elementAttribute.value = this.currentLanguage;
      });

    if (this.onLangChangeSubscribe) {
      this.onLangChangeSubscribe.unsubscribe();
    }

    if (this.translationsLoadedSubscribe) {
      this.translationsLoadedSubscribe.unsubscribe();
    }

    this.translate.setDefaultLang('en');

    this.defaultLanguage = this.translate.getDefaultLang();

    const browserLanguage: string = this.translate.getBrowserCultureLang();
    const storageLanguage: any = this.localStorageService.getItem('language');

    this.currentLanguage = storageLanguage || browserLanguage || this.defaultLanguage;

    this.updateLangInUrl();

    this.loadLanguage().subscribe((trans: any) => {
      this.translations = trans;
    });

    this.onLangChangeSubscribe = this.translate.onLangChange.subscribe((data: any) => {
      this.translations = data.translations;
    });
  }

  public getLanguageIso(): string {
    return this.currentLanguage.length === 2 ? this.currentLanguage + '_' + this.currentLanguage.toUpperCase() : this.currentLanguage.replace(/-/g, '_');
  }

  public getTranslation(key: string | string[]): Observable<any> {
    if (this.translations) {
      return Observable.create((observer: Observer<any>) => {
        if(typeof key === 'string') {
          observer.next(this.translations[key as string]);

        } else if (typeof key === 'object') {
          let obj: any = {};

          key.forEach((el: any) => {
            obj[el] = this.translations[el];
          });

          observer.next(obj);
        }

        observer.complete();
      });
    } else {
        return Observable.create((observer: Observer<any>) => {
          this.loadLanguage().subscribe((trans: any) => {
            if(typeof key === 'string') {
              observer.next(trans[key as string]);

            } else if (typeof key === 'object') {
              let obj: any = {};

              key.forEach((el: any) => {
                obj[el] = trans[el];
              });

              observer.next(obj);
            }

            observer.complete();
          });
        });
      }
  }

  public loadLanguage(): Observable<any> {
    const lang: string = stringify('lang=' + this.currentLanguage);

    return Observable.create((observer: Observer<any>) => {
       this.translationsLoadedSubscribe = this.getLanguage(lang).subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        const translation: any = res.data.interface;

        this.translations = translation;

        this.translate.setTranslation(this.currentLanguage, translation);
        this.translate.use(this.currentLanguage);

        observer.next(translation);
        observer.complete();
      });
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

  public updateLangInUrl(): void {
    const currentUrl: string = this.location.path();

    const pathAndQueryParams: string[] = currentUrl.split('?');
    const queryParamsString: string = pathAndQueryParams[1];

    const path: string = pathAndQueryParams[0];
    const queryParams: any = queryParamsString ? Config.parseUrl(queryParamsString) : {};

    queryParams.lang = this.currentLanguage;

    this.urlChangeService.replaceState(path, Config.objToQuery(queryParams), true);
  }
}
