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

  public getTimeUnitByCode(units: any[], code: string): any {
    return units.find(unit => unit.code === code);
  }

  public getCurrencyUnitByCode(units: any[], code: string): any {
    return units.find(unit => unit.code === code);
  }

  public getCurrencyUnitForLang(units: any[], lang: string): any {
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
}
