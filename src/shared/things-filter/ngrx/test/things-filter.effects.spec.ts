import { Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { cold, hot } from 'jasmine-marbles';

import { ThingsFilterEffects } from '../things-filter.effects';
import * as fromActions from '../things-filter.actions';

describe('ThingsFilter effects', () => {

  describe('getThigsFilter', () => {
    it('GetThingsFilterSuccess', () => {
      const actions = new Actions(cold('-a-|', {a: {type: 'GET_THINGS_FILTER'}}));
      const service = jasmine.createSpyObj('thingsFilterService', ['getThings']);
      service.getThings.and.returnValue(of({data: 'expected'}));
      const effects = new ThingsFilterEffects(actions, service);

      const expectedObservable = hot('-a-|', {a: new fromActions.GetThingsFilterSuccess('expected')});
      expect(effects.getThigsFilter$).toBeObservable(expectedObservable);
    });
  });
});

