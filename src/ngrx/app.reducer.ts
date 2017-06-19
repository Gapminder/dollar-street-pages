import { ActionReducer, Action } from '@ngrx/store';

import { AppState, AppStateInterface, appDefaultState } from './app.state';

import { AppActions } from './app.actions';

export const appReducer: ActionReducer<AppStateInterface> = (state: AppState, action: Action) => {
    let newState: AppState;

    if(!state) {
        state = appDefaultState;
    }

    switch (action.type) {
        case AppActions.SET_STREET_SETTINGS:
            newState = AppActions.setStreetSettings(state, action.payload);
        break;

        default:
            newState = state;
        break;
    }

    return newState;
}
