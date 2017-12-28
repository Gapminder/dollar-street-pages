import { Injectable } from '@angular/core';
import { TimeUnit } from '../../interfaces';

const defaultTimeUnit = {
  code: 'MONTH',
  name: 'Month',
  name1: 'Monthly income',
  per: 'month'
};

@Injectable()
export class IncomeCalcServiceMock {
  public getTimeUnitByCode (units = [], code: string): TimeUnit {
    return defaultTimeUnit;
  }

  public getCurrencyUnitByCode (units = [], code: string): TimeUnit {
    return defaultTimeUnit;
  }

  public getCurrencyUnitForLang (units = [], lang: string): TimeUnit {
    return defaultTimeUnit;
  }
}
