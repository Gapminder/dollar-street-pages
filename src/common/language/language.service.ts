import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Config } from '../../app.config';
import { Subscription } from 'rxjs/Subscription';
import { UrlChangeService } from '../url-change/url-change.service';
import { LocalStorageService } from '../guide/localstorage.service';
import { TranslateService } from 'ng2-translate';
import { EventEmitter } from 'events';

@Injectable()
export class LanguageService {
  public http: Http;
  public location: Location;
  public window: Window = window;
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
  public translationsLoadedEvent: EventEmitter = new EventEmitter();
  public translationsLoadedString: string = 'TRANSLATIONS_LOADED';
  public sanitizer: DomSanitizer;

  public constructor(@Inject(Http) http: Http,
                     @Inject(Location) location: Location,
                     @Inject(UrlChangeService) urlChangeService: UrlChangeService,
                     @Inject(TranslateService) translate: TranslateService,
                     @Inject(LocalStorageService) localStorageService: LocalStorageService,
                     @Inject(DomSanitizer) sanitizer: DomSanitizer) {
    this.http = http;
    this.location = location;
    this.urlChangeService = urlChangeService;
    this.translate = translate;
    this.localStorageService = localStorageService;
    this.sanitizer = sanitizer;

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

    const urlLanguage: string = this.getLanguageFromUrl(this.urlChangeService.location.path());
    const storageLanguage: any = this.localStorageService.getItem('language');
    const browserLanguage: string = this.translate.getBrowserCultureLang();

    this.currentLanguage = urlLanguage !== 'en' ? urlLanguage : storageLanguage || browserLanguage.slice(0, 2) || this.defaultLanguage;

    this.updateLangInUrl();

    this.loadLanguage().subscribe((trans: any) => {
      this.translations = trans;
      this.translationsLoadedEvent.emit(this.translationsLoadedString, trans);
    });

    this.onLangChangeSubscribe = this.translate.onLangChange.subscribe((data: any) => {
      this.translations = data.translations;
    });
  }

  public getLanguageIso(): string {
    return this.currentLanguage.length === 2 ? this.currentLanguage + '_' + this.currentLanguage.toUpperCase() : this.currentLanguage.replace(/-/g, '_');
  }

  public getTranslation(key: string | string[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      if (this.translations) {
        this.processTranslation(observer, this.translations, key);
      } else {
        Observable.fromEvent(this.translationsLoadedEvent, this.translationsLoadedString).subscribe((trans: any) => {
          this.processTranslation(observer, trans, key);
        });
      }
    });
  }

  public loadLanguage(): Observable<any> {
    const lang: string = `lang=${this.currentLanguage}`;

    return Observable.create((observer: Observer<any>) => {
       this.translationsLoadedSubscribe = this.getLanguage(lang).subscribe((res: any) => {
        if (res.err) {
          console.error(res.err);
          return;
        }

        this.translations = res.data;

        this.translate.setTranslation(this.currentLanguage, this.translations);
        this.translate.use(this.currentLanguage);

        observer.next(this.translations);
        observer.complete();
      });
    });
  }

  public getSunitizedString(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value.replace(/^\<p\>/, '')
                                                        .replace(/\<\/p\>$/, '')
                                                        .replace(/&lt;/g, '<')
                                                        .replace(/&gt;/g, '>'));
  }

  public getLanguageFromUrl(url: string): string {
    let regex = new RegExp('[?&]' + 'lang' + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);

    if (!results || !results[2]) {
      return this.defaultLanguage;
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  public changeLanguage(lang: string): void {
    this.localStorageService.setItem('language', lang);

    this.window.location.href = this.window.location.href.replace(`lang=${this.currentLanguage}`, `lang=${lang}`);
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

  private processTranslation(observer: Observer<any>, translations: any, key: string | string[]): void {
    if(typeof key === 'string') {
      observer.next(translations[key as string]);

    } else if (typeof key === 'object') {
      let obj: any = {};

      key.forEach((el: any) => {
        obj[el] = translations[el];
      });

      observer.next(obj);
    }
  }
}
