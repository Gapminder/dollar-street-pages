import { Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { cold, hot } from 'jasmine-marbles';

import { StreetSettingsEffects } from '../street-settings.effects';
import * as fromStreetSettingsActions from '../street-settings.actions';

describe('StreetSettings effects', () => {
  describe('getStreetSettings', () => {
    it('return street settings on', () => {
      const actions = new Actions(cold('-a-|', {a: {type: 'GET_STREET_SETTINGS'}}));
      const service = jasmine.createSpyObj('streetSettingsService', ['getStreetSettings']);
      service.getStreetSettings.and.returnValue(of({data: 'expected'}));
      const effects = new StreetSettingsEffects(actions, service);

      const expectedObservable = hot('-a-|', {a: new fromStreetSettingsActions.GetStreetSettingsSuccess('expected')});
      expect(effects.getStreetSettings$).toBeObservable(expectedObservable);
    });
  });
});

