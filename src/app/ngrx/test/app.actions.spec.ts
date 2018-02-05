import * as fromAppActions from '../app.actions';

describe('App actions', () => {
  it('should create action', () => {
    const action = new fromAppActions.SetQuery('sdf');

    expect({...action}).toEqual({
      type: fromAppActions.SET_QUERY,
      payload: 'sdf'
    });
  });
});
