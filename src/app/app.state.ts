import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { streetSettingsReducer } from '../common';
import { thingsFilterReducer } from '../shared/things-filter/things-filter.reducers';
import { countriesFilterReducer } from '../shared/countries-filter/countries-filter.reducers';

export interface AppState {
    streetSettings: any;
    thingsFilter: any;
    countriesFilter: any;
}

const reducers = {
    streetSettings: streetSettingsReducer,
    thingsFilter: thingsFilterReducer,
    countriesFilter: countriesFilterReducer
};

export const rootReducer = combineReducers(reducers);
