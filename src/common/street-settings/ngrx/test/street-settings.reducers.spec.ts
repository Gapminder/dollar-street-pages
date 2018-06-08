import * as fromStreetActions from '../street-settings.actions';
import * as fromStreetReducers from '../street-settings.reducers';
import { DrawDividersInterface } from '../../../../interfaces';

describe('Street-settings Reducers', () => {

  describe('default state', () => {
    it('should return default state', () => {
      const {initialState} = fromStreetReducers;
      const action = {} as any;
      const state = fromStreetReducers.streetSettingsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('GET_STREET_SETTINGS_SUCCESS action', () => {
    it('change streetSettings in state', () => {
      const payload: DrawDividersInterface = {
        showDividers: true,
        low: 1,
        medium: 2,
        high: 3,
        poor: 4,
        rich: 5,
        lowDividerCoord: 5,
        mediumDividerCoord: 6,
        highDividerCoord: 7,
        dividers: [1, 2, 3]
      };
      const {initialState} = fromStreetReducers;
      const action = new fromStreetActions.GetStreetSettingsSuccess(payload);
      const state = fromStreetReducers.streetSettingsReducer(initialState, action);

      expect(state.streetSettings).toEqual(payload);
    });
  });
});
