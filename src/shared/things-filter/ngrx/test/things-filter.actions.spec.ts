import * as fromActions from '../things-filter.actions';
import { Thing } from '../../../../interfaces';

describe('Things-filter actions', () => {

  describe('Should create action', () => {
    it('GetThingsFilter', () => {
      const payload = 'thing=Families&countries=World&regions=World';
      const action = new fromActions.GetThingsFilter(payload);

      expect({...action}).toEqual({
        type: fromActions.GET_THINGS_FILTER,
        payload
      });
    });

    it('GetThingsFilterSuccess', () => {
      const payload = 'Thing'; // should has ThingsState type
      const action = new fromActions.GetThingsFilterSuccess(payload);

      expect({...action}).toEqual({
        type: fromActions.GET_THINGS_FILTER_SUCCESS,
        payload
      });
    });

  });
});



interface ThingsState {
  otherThings: Thing[];
  popularThings: Thing[];
  relatedThings: Thing[];
  thing: Thing;
}
