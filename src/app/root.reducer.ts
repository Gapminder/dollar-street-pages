import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';

import { streetSettingsReducer } from '../common';
import {
    thingsFilterReducer,
    countriesFilterReducer
} from '../shared';
import {
    appReducer
} from './app.reducers';

export const reducers = {
    app: appReducer,
    streetSettings: streetSettingsReducer,
    thingsFilter: thingsFilterReducer,
    countriesFilter: countriesFilterReducer
};

export const rootReducer = combineReducers(reducers);