import { ActionReducer, Action, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { AppActions } from './app.actions';

import { streetSettingsReducer } from './app.reducers';

export interface AppStore {
    streetSettings: any
}

const reducers = {
    streetSettings: streetSettingsReducer
};

export const rootReducer = compose(combineReducers)(reducers);
