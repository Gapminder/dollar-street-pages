import { Injectable } from '@angular/core';

@Injectable()
export class IncomeCalcService {
  public calcPlaceIncome(income: number, timeUnit: string, currencyValue): number {
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

    return resultIncome * currencyValue;
  }

  public getTimeUnitByCode(units: any[], code: string): string {
    return units.find(unit => unit.code === code);
  }

  public getCurrencyUnitByCode(units: any[], code: string): any {
    return units.find(unit => unit.code === code);
  }

  public getCurrencyUnitByLang(units: any[], lang: string): any {
    let unit = null;

    switch(lang) {
      case 'en': {
        unit = units.find(unit => unit.code === 'USD');
        break;
      }
      case 'es-ES': {
        unit = units.find(unit => unit.code === 'EUR');
        break;
      }
      case 'sv-SE': {
        unit = units.find(unit => unit.code === 'SEK');
        break;
      }
    }

    return unit;
  }
}
