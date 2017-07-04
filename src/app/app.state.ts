import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { streetSettingsReducer } from '../common';
import {
    thingsFilterReducer,
    countriesFilterReducer,
    headerReducer
} from '../shared';

const reducers = {
    streetSettings: streetSettingsReducer,
    thingsFilter: thingsFilterReducer,
    countriesFilter: countriesFilterReducer,
    header: headerReducer
};

export const rootReducer = combineReducers(reducers);
