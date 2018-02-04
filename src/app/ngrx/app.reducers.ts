import * as AppActions from './app.actions';
import { AppState } from '../../interfaces';

export const initialState: AppState = {
    query: ''
};

export function appReducer(state: AppState = initialState, action: AppActions.Actions): AppState {
    switch (action.type) {
        case AppActions.SET_QUERY: {
            return Object.assign({}, state, {query: action.payload});
        }

        default:
            return state;
    }
}
