import { ActionReducer, Action } from '@ngrx/store';
import * as ThingsFilterActions from './things-filter.actions';

export interface State {
    activeThing: object;
};

export const initialState: State = {
    activeThing: null
};

export function thingsFilterReducer(state: any, action: ThingsFilterActions.Actions): any {
    switch (action.type) {
        case ThingsFilterActions.GET_THINGS_FILTER_SUCCESS:
            return action.payload;

        case ThingsFilterActions.SELECT_THING:
            return action.payload;

        default:
            return state;
    }
}
