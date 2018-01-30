import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { UrlChangeService } from '../url-change/url-change.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import * as _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { EventEmitter } from 'events';
import { UtilsService } from '../utils/utils.service';
import * as LanguageActions from './ngrx/language.actions';
import { Store } from '@ngrx/store';
import { AppStates } from '../../interfaces';

@Injectable()
export class LanguageService {
  public window: Window = window;
  public currentLanguage: string;
  public defaultLanguage: string = 'en';
  public languageName: string;
  public translations: any;
  public onLangChangeSubscribe: Subscription;
  public translationsLoadedSubscribe: Subscription;
  public documentLoadedSubscription: Subscription;
  public translationsLoadedEvent: EventEmitter = new EventEmitter();
  public translationsLoadedString: string = 'TRANSLATIONS_LOADED';
  public languagesList: Observable<any>;
  public availableLanguage: string[] = ['en', 'es-ES', 'sv-SE'];

  public constructor(private http: Http,
                     private location: Location,
                     private urlChangeService: UrlChangeService,
                     private translate: TranslateService,
                     private localStorageService: LocalStorageService,
                     private sanitizer: DomSanitizer,
                     private utilsService: UtilsService,
                     private store: Store<AppStates>) {

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

    this.translate.setDefaultLang(this.defaultLanguage);
    this.defaultLanguage = this.translate.getDefaultLang();

    this.setCurrentLanguage(this.availableLanguage);
    this.updateLangInUrl();

    this.loadLanguage().subscribe((trans: any) => {
      this.translations = trans;
      this.translationsLoadedEvent.emit(this.translationsLoadedString, trans);
    });

    this.onLangChangeSubscribe = this.translate.onLangChange.subscribe((data: any) => {
      this.translations = data.translations;
    });

    this.languagesList = this.getLanguagesList().map((res: any) => {
      if (res.err) {
        console.error(res.err);
        return;
      }

      return res.data;
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
    if (this.currentLanguage !== lang) {
      this.store.dispatch(new LanguageActions.UpdateLanguage(lang));
    }
  }

  public getLanguage(query: string): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/language?${query}`).map((res: any) => {
      let parseRes = JSON.parse(res._body);
      return {err: parseRes.error, data: parseRes.data};
    });
  }

  private setCurrentLanguage(languages: string[]): void {
    const storageLanguage: any = this.localStorageService.getItem('language');
    const browserLanguage: string = this.translate.getBrowserCultureLang();

    const language = storageLanguage || browserLanguage.slice(0, 2) || this.defaultLanguage;

    const found = languages.indexOf(language) !== -1;

    this.currentLanguage = found ? language : this.defaultLanguage;
    this.store.dispatch(new LanguageActions.UpdateLanguage(this.currentLanguage));
  }

  private updateLangInUrl(): void {
    const currentUrl: string = this.location.path();

    const pathAndQueryParams: string[] = currentUrl.split('?');
    const queryParamsString: string = pathAndQueryParams[1];

    const path: string = pathAndQueryParams[0];
    const queryParams: any = queryParamsString ? this.utilsService.parseUrl(queryParamsString) : {};

    queryParams.lang = this.currentLanguage;
  }

  public getLanguagesList(): Observable<any> {
    return this.http.get(`${environment.consumerApi}/v1/languagesList`).map((res: any) => {
      let parseRes = JSON.parse(res._body);

      let currentLanguageObject: any = _.find(parseRes.data, {code: this.currentLanguage});

      if (currentLanguageObject) {
        this.languageName = currentLanguageObject.name;
      }

      return {err: parseRes.error, data: parseRes.data};
    });
  }

  public getLanguageParam(): string {
    return `&lang=${this.currentLanguage}`;
  }

  private processTranslation(observer: Observer<any>, translations: any, key: string | string[]): void {
    if (typeof key === 'string') {
      observer.next(translations[key as string]);

    } else if (typeof key === 'object') {
      const obj = {};

      key.forEach((el) => {
        obj[el] = translations[el];
      });

      observer.next(obj);
    }
  }
}
