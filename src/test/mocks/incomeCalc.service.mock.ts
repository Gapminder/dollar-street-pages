import { Injectable } from '@angular/core';
import { Currency, TimeUnit } from '../../interfaces';
import { MathServiceMock } from './math.service.mock';

const defaultTimeUnit: TimeUnit = {
  code: 'MONTH',
  name: 'Month',
  name1: 'Monthly income',
  per: 'month'
};

const defaultCurrencyUnit: Currency = {
  currency: 'string',
  code: 'string',
  value: 1,
  symbol: 'string',
  updated: 1,
  translations: [{}]
};

@Injectable()
export class IncomeCalcServiceMock {
  public getTimeUnitByCode(units = [], code: string): TimeUnit {
    return defaultTimeUnit;
  }

  public getCurrencyUnitByCode(units = [], code: string): Currency {
    return defaultCurrencyUnit;
  }

  public getCurrencyUnitForLang(units = [], lang: string): TimeUnit {
    return defaultTimeUnit;
  }

  public calcPlaceIncome(income: number, timeUnit: string, currencyValue): string {
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

    return new MathServiceMock().roundIncome(currencyIncome, currencyIncome <= 10).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
}
