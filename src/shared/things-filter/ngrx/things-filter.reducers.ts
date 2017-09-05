import * as ThingsFilterActions from './things-filter.actions';

export interface State {
    thingsFilter: any;
};

export const initialState: State = {
    thingsFilter: null
};

export function thingsFilterReducer(state: any = initialState, action: ThingsFilterActions.Actions): any {
    switch (action.type) {
        case ThingsFilterActions.GET_THINGS_FILTER_SUCCESS:
            return Object.assign({}, state, {thingsFilter: action.payload});

        default:
            return state;
    }
}
