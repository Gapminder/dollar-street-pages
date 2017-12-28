import * as ThingsFilterActions from './things-filter.actions';
import { ThingsState } from '../../../interfaces';

export const initialState: ThingsState = {
    thingsFilter: null
};

export function thingsFilterReducer(state: ThingsState = initialState, action: ThingsFilterActions.Actions): ThingsState {
    switch (action.type) {
        case ThingsFilterActions.GET_THINGS_FILTER_SUCCESS:
            return Object.assign({}, state, {thingsFilter: action.payload});

        default:
            return state;
    }
}
