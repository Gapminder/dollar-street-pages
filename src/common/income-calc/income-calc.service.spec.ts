import { IncomeCalcService } from "./income-calc.service";
import { MathServiceMock } from "../../test/mocks/math.service.mock";
import { MathService } from "../index";
import { TimeUnit, Currency } from "../../interfaces";

describe('IncomeCalcService Test', () => {
  let service: IncomeCalcService;

  beforeEach(() => {
    service = new IncomeCalcService(new MathServiceMock);
  });

  it('income by DAY divide income by 30', () => {
    expect(service.calcPlaceIncome(100, 'DAY', 1)).toEqual('3.33');
  });

  it('income by WEEK divide income by 4', () => {
    expect(service.calcPlaceIncome(100, 'WEEK', 1)).toEqual('25');
  });

  it('income by MONTH as is', () => {
    expect(service.calcPlaceIncome(100, 'MONTH', 1)).toEqual('100');
  });

  it('income by YEAR multiply by 12', () => {
    expect(service.calcPlaceIncome(10, 'YEAR', 1)).toEqual('120');
  });

  it('should insert space between hundreds', () => {
    expect(service.calcPlaceIncome(100, 'YEAR', 1)).toEqual('1 200');
  });

  it('getTimeUnitByCode', () => {
    const timeUnits: TimeUnit[] = [
      {
        code: 'DAY',
        name: 'Day',
        name1: 'Daily Income',
        per: 'day'
      },
      {
        code: 'WEEK',
        name: 'Week',
        name1: 'Weekly Income',
        per: 'week'
      },
      {
        code: 'MONTH',
        name: 'Month',
        name1: 'Monthly Income',
        per: 'month'
      },
      {
        code: 'YEAR',
        name: 'Year',
        name1: 'Yearly Income',
        per: 'year'
      }
    ];

    expect(service.getTimeUnitByCode(timeUnits, 'DAY')).toEqual(timeUnits[0]);
    expect(service.getTimeUnitByCode(timeUnits, 'WEEK')).toEqual(timeUnits[1]);
    expect(service.getTimeUnitByCode(timeUnits, 'MONTH')).toEqual(timeUnits[2]);
    expect(service.getTimeUnitByCode(timeUnits, 'YEAR')).toEqual(timeUnits[3]);
  });

  it('getCurrencyUnitByCode', () => {
    expect(service.getCurrencyUnitByCode(currencyUnits, 'EUR')).toEqual(currencyUnits[0]);
  });

  it('getCurrencyUnitByCode: return default currency if code wasn`t set', () => {
    expect(service.getCurrencyUnitByCode(currencyUnits, '')).toEqual(currencyUnits[1]);
  });

  it('getCurrencyUnitForLang', () => {
    expect(service.getCurrencyUnitForLang(currencyUnits, 'es-ES')).toEqual(currencyUnits[0]);
    expect(service.getCurrencyUnitForLang(currencyUnits, 'en')).toEqual(currencyUnits[1]);
    expect(service.getCurrencyUnitForLang(currencyUnits, 'sv-SE')).toEqual(currencyUnits[2]);
    expect(service.getCurrencyUnitForLang(currencyUnits, 'default')).toEqual(currencyUnits[1]);
  });
});


const currencyUnits: Currency[] = [
  {
    currency: 'Euro',
    code: 'EUR',
    value: 0.816601,
    symbol: '€',
    updated: 0,
    translations: [{}]
  },
  {
    currency: 'Dollar',
    code: 'USD',
    value: 1,
    symbol: '$',
    updated: 0,
    translations: [{}]
  },
  {
    currency: 'Krona',
    code: 'SEK',
    value: 1,
    symbol: 'kr',
    updated: 0,
    translations: [{}]
  }
];