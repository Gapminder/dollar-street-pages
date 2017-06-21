import { ActionReducer, Action } from '@ngrx/store';
import { AppActions } from './app.actions';
import { AppStore } from './app.store';

export const streetSettingsReducer: ActionReducer<AppStore> = (state: AppStore, action: Action) => {
    switch (action.type) {
        case AppActions.GET_STREET_SETTINGS_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
