import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from "events";

@Injectable()
export class LanguageServiceMock {
  public currentLanguage: string;
  public defaultLanguage: string = 'en';
  public languagesList: Observable<any> = Observable.of(['English', 'Brasilian']);
  public translationsLoadedEvent: EventEmitter = new EventEmitter();
  public translationsLoadedString = 'TRANSLATIONS_LOADED_TEST';

  public getLanguageParam(): string {
    return '&lang=en';
  }

  public getLanguagesList(): Observable<any> {
    return this.languagesList;
  }

  public getLanguageIso(): string {
    return 'en_EN';
  }

  public getTranslation(key: string | string[]): Observable<any> {
    if (typeof key === 'string') {
      let value: string = void 0;

      switch (key) {
        case 'ABOUT': {
          value = 'About';
          break;
        }

        case 'WORLD': {
          value = 'World';
          break;
        }

        default:
          value = 'Translated';
      }

      return Observable.of(value);
    } else if (typeof key === 'object') {
      return Observable.of({ABOUT: 'About', WORLD: 'World'});
    }
  }

  public getSunitizedString(key: string): string {
    return 'THIS_IS_SANITIZED_STRING';
  }
}
