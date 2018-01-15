import { Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { cold, hot } from 'jasmine-marbles';

import { MatrixEffects } from '../matrix.effects';
import * as fromMatrixActions from '../matrix.actions';
import { Currency, TimeUnit } from '../../../interfaces';

describe('Matrix effects', () => {
  it('getMatrixImages', () => {
    const actions = new Actions(cold('-a-|', {a: {type: 'GET_MATRIX_IMAGES'}}));
    const service = jasmine.createSpyObj('matrixService', ['getMatrixImages']);
    service.getMatrixImages.and.returnValue(of({data: 'expected'}));
    const effects = new MatrixEffects(actions, service);

    const expectedObservable = hot('-a-|', {a: new fromMatrixActions.GetMatrixImagesSuccess('expected')});
    expect(effects.getMatrixImages).toBeObservable(expectedObservable);
  });

  it('getPinnedPlaces', () => {
    const actions = new Actions(cold('-a-|', {a: {type: 'GET_PINNED_PLACES'}}));
    const service = jasmine.createSpyObj('matrixService', ['getPinnedPlaces']);
    service.getPinnedPlaces.and.returnValue(of({data: 'expected'}));
    const effects = new MatrixEffects(actions, service);

    const expectedObservable = hot('-a-|', {a: new fromMatrixActions.GetPinnedPlacesSuccess('expected')});
    expect(effects.getPinnedPlaces).toBeObservable(expectedObservable);
  });

  it('getTimeUnits', () => {
    const actions = new Actions(cold('-a-|', {a: {type: 'GET_TIME_UNITS'}}));
    const service = jasmine.createSpyObj('matrixService', ['getCurrencyUnits']);
    service.getCurrencyUnits.and.returnValue(of({data: timeUnit}));
    const effects = new MatrixEffects(actions, service);

    const expectedObservable = hot('-a-|', {a: new fromMatrixActions.GetTimeUnitsSuccess(timeUnit)});
    expect(effects.getTimeUnits).toBeObservable(expectedObservable);
  });

  it('getCurrencyUnits', () => {
    const actions = new Actions(cold('-a-|', {a: {type: 'GET_CURRENCY_UNITS'}}));
    const service = jasmine.createSpyObj('matrixService', ['getCurrencyUnits']);
    service.getCurrencyUnits.and.returnValue(of({data: [currency]}));
    const effects = new MatrixEffects(actions, service);

    const expectedObservable = hot('-a-|', {a: new fromMatrixActions.GetCurrencyUnitsSuccess([currency])});
    expect(effects.getCurrencyUnits).toBeObservable(expectedObservable);
  });
});

// TODO this looks weird
const timeUnit: TimeUnit[] = [
  {code: 'DAY', name: 'Day', name1: 'Daily income', per: 'day'},
  {code: 'WEEK', name: 'Week', name1: 'Weekly income', per: 'week'},
  {code: 'MONTH', name: 'Month', name1: 'Monthly income', per: 'month'},
  {code: 'YEAR', name: 'Year', name1: 'Yearly income', per: 'year'}
];

const currency: Currency = {
  currency: 'currency',
  code: 'code',
  value: 1,
  symbol: 'symbol',
  updated: 1,
  translations: [{}]
};

