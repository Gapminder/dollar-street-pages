import { Injectable, Inject } from '@angular/core';
import { MathService } from '../math/math.service';

@Injectable()
export class IncomeCalcService {
  constructor(@Inject(MathService) private math) {}

  public calcPlaceIncome(income: number, timeUnit: string, currencyValue): number {
    if (!income) {
      return;
    }

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

    return (currencyIncome >= 10 ? this.math.round(currencyIncome) : this.math.round(currencyIncome, true)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  public getTimeUnitByCode(units: any[], code: string): any {
    if (units) {
      return units.find(unit => unit.code === code);
    }
  }

  public getCurrencyUnitByCode(units: any[], code: string): any {
    if (units) {
      return units.find(unit => unit.code === code);
    }
  }

  public getCurrencyUnitForLang(units: any[], lang: string): any {
    if (!units) {
      return;
    }

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
