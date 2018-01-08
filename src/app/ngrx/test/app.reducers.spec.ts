import * as fromAppActions from '../app.actions';
import * as fromAppReducers from '../app.reducers';

describe('App Reducers', () => {

  describe('default state', () => {
    it('should return default state', () => {
      const {initialState} = fromAppReducers;
      const action = {} as any;
      const state = fromAppReducers.appReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SET_QUERY action', () => {
    it('fill query in state', () => {
      const {initialState} = fromAppReducers;
      const action = new fromAppActions.SetQuery('test query');
      const state = fromAppReducers.appReducer(initialState, action);

      expect(state.query).toEqual('test query');
    });
  })

});
