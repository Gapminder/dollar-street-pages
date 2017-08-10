import * as AppActions from './app.actions';

export interface State {
    query: string;
    thing: null;
    incomeFilter: boolean;
    quickGuide: boolean;
};

export const initialState: State = {
    query: '',
    thing: null,
    incomeFilter: false,
    quickGuide: false
};

export function appReducer(state: any, action: AppActions.Actions): any {
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

        default:
            return state;
    }
}
