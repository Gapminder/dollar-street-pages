import { ActionReducer, Action } from '@ngrx/store';
import { AppActions } from './app.actions';

export function appReducer(state: any, action: Action): any {
    switch (action.type) {
        case AppActions.SET_QUERY: {
            return Object.assign({}, state, {query: action.payload});
        }

        case AppActions.SET_THING: {
            return Object.assign({}, state, {thing: action.payload});
        }

        case AppActions.OPEN_INCOME_FILTER: {
            return Object.assign({}, state, {incomeFilter: action.payload});
        }

        case AppActions.OPEN_QUICK_GUIDE: {
            return Object.assign({}, state, {quickGuide: action.payload});
        }

        /*case AppActions.SET_HOVER_PLACE: {
            return Object.assign({}, state, {hoverThing: action.payload});
        }*/

        default:
            return state;
    }
}
