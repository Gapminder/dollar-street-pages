import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LanguageServiceMock {
  public languagesList: Observable<any> = Observable.of(['English', 'Brasilian']);

  public getLanguageParam(): string {
    return '&lang=en';
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
