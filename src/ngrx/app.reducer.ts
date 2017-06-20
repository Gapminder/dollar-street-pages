import { ActionReducer, Action, combineReducers } from '@ngrx/store';
import { AppState, AppStateInterface, appStateName } from './app.state';
import { AppActions } from './app.actions';

export const appReducerFunc: ActionReducer<AppStateInterface> = (state: AppState, action: Action) => {
    let newState: AppState;

    if(!state) {
        state = new AppState();
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

const reducers = { appState: appReducerFunc };

const productionReducer: ActionReducer<AppStateInterface> = combineReducers(reducers);

export function appReducer(state: AppState, action: Action) {
    return productionReducer(state, action);
}
