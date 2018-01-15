import { Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { cold, hot } from 'jasmine-marbles';

import { CountriesFilterEffects } from '../countries-filter.effects';
import * as fromStreetSettingsActions from '../countries-filter.actions';

describe('Countries-filter effects', () => {

  describe('getCountriesFilter', () => {

    it('return countries', () => {
      const actions = new Actions(cold('-a-|', {a: {type: 'GET_COUNTRIES_FILTER'}}));
      const service = jasmine.createSpyObj('countriesFilterService', ['getCountries']);
      service.getCountries.and.returnValue(of({data: 'expected'}));
      const effects = new CountriesFilterEffects(actions, service);

      const expectedObservable = hot('-a-|', {a: new fromStreetSettingsActions.GetCountriesFilterSuccess('expected')});
      expect(effects.getCountriesFilter$).toBeObservable(expectedObservable);
    });
  });
});

