import { ActionReducer, Action } from '@ngrx/store';
import { ThingsFilterActions } from './things-filter.actions';

export function thingsFilterReducer(state: any, action: Action): any {
    switch (action.type) {
        case ThingsFilterActions.GET_THINGS_FILTER_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
