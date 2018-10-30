import { Injectable } from '@angular/core';
import { MathService } from '../math/math.service';
import { Currency, TimeUnit } from '../../interfaces';
import { assign, filter, get, map } from 'lodash';

const DEFAULT_CURRENCY = 'USD';

@Injectable()
export class IncomeCalcService {
  constructor(private math: MathService) {}

  calcPlaceIncome(income: number, timeUnit: string, currencyValue): string {
    let resultIncome: number = 0;

    switch(timeUnit) {
      case 'DAY': {
        resultIncome = income / 30;
        break;
      }

      case 'WEEK': {
        resultIncome = income / 4;
        break;
      }

      case 'MONTH': {
        resultIncome = income;
        break;
      }

      case 'YEAR': {
        resultIncome = income * 12;
        break;
      }
    }

    let currencyIncome = resultIncome * currencyValue;

    return this.math.roundIncome(currencyIncome, currencyIncome <= 10).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  getTimeUnitByCode(units = [], code: string): TimeUnit {
    return units.find(unit => unit.code === code);
  }

  getCurrencyUnitByCode(units = [], code: string, lang = 'USD'): Currency {
    const currencyCode = code.length ? code : DEFAULT_CURRENCY;
    const currencyUnit = units.find(unit => unit.code.toUpperCase() === currencyCode.toUpperCase());

    return this.addCurrencyName(currencyUnit, lang);
  }

  getCurrencyUnitForLang(units = [], lang: string): Currency {
    let code = 'USD';

    switch(lang) {
      case 'en': {
        code = 'USD';
        break;
      }
      case 'es-ES': {
        code = 'EUR';
        break;
      }
      case 'sv-SE': {
        code = 'SEK';
        break;
      }
    }

    return units.find(unit => unit.code === code);
  }

  addCurrencyNames(currencyList: Currency[], lang: string): Currency[] {
    return map(currencyList, currency => {

      return this.addCurrencyName(currency, lang);
    });
  }

  addCurrencyName(currency: Currency, lang: string) {
    const currencyName = this.getCurrencyName(currency, lang);

    return assign(currency, { visibleName: currencyName});
  };

  getCurrencyName(currency: Currency, lang: string): string {
    const DEFAULT_LANG = 'en';
    const CURRENCY_TEXT_KEY = 'CURRENCY_TEXT';

    if (currency.translations.length) {
      const currentLangTranslation = filter(currency.translations, {lang});
      if (currentLangTranslation.length) {

        return get(currentLangTranslation[0], CURRENCY_TEXT_KEY, '');
      } else {
        const enTranslation = filter(currency.translations, {lang: DEFAULT_LANG});

        return get(enTranslation[0], CURRENCY_TEXT_KEY, '');
      }
    } else {
      return currency.currency;
    }
  }
}
