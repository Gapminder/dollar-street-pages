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

        default:
            return state;
    }
}
