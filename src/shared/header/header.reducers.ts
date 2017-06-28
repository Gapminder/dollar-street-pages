import { ActionReducer, Action } from '@ngrx/store';
import { HeaderActions } from './header.actions';
import { HeaderState } from '../../interfaces';

export function headerReducer(state: HeaderState, action: Action): any {
    switch (action.type) {
        case HeaderActions.SET_QUERY: {
            return Object.assign({}, state, {query: action.payload});
        }

        case HeaderActions.SET_THING: {
            return Object.assign({}, state, {thing: action.payload});
        }

        case HeaderActions.SET_HOVER_PLACE: {
            return Object.assign({}, state, {hoverThing: action.payload});
        }

        default:
            return state;
    }
}
