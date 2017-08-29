import * as AppActions from './app.actions';

export interface State {
    query: string;
};

export const initialState: State = {
    query: ''
};

export function appReducer(state: any = initialState, action: AppActions.Actions): any {
    switch (action.type) {
        case AppActions.SET_QUERY: {
            return Object.assign({}, state, {query: action.payload});
        }

        /*case AppActions.UPDATE_MATRIX: {
            return Object.assign({}, state, {updateMatrix: action.payload});
        }

        case AppActions.ACTIVATE_PIN_MODE: {
            return Object.assign({}, state, {pinMode: action.payload});
        }

        case AppActions.OPEN_INCOME_FILTER: {
            return Object.assign({}, state, {incomeFilter: action.payload});
        }

        case AppActions.OPEN_QUICK_GUIDE: {
            return Object.assign({}, state, {quickGuide: action.payload});
        }*/

        default:
            return state;
    }
}
