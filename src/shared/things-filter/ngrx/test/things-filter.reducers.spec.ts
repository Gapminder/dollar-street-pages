import * as fromActions from '../things-filter.actions';
import * as fromReducers from '../things-filter.reducers';
import { ThingsState } from '../../../../interfaces';

describe('Things-filter Reducers', () => {

  describe('default state', () => {
    it('should return default state', () => {
      const {initialState} = fromReducers;
      const action = {} as any;
      const state = fromReducers.thingsFilterReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('GET_THINGS_FILTER_SUCCESS action', () => {
    it('change thingsFilter in state', () => {
      const payload = 'any' as any; // ThingsState should be here but it's to hard to create
      const {initialState} = fromReducers;
      const action = new fromActions.GetThingsFilterSuccess(payload);
      const state = fromReducers.thingsFilterReducer(initialState, action);

      expect(state.thingsFilter).toEqual(payload);
    });
  });
});
