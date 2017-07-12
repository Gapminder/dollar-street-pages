import { compose } from '@ngrx/core/compose';
import { combineReducers, ActionReducer } from '@ngrx/store';
import { AppStore } from '../interfaces';
import { streetSettingsReducer } from '../common';
import {
    thingsFilterReducer,
    countriesFilterReducer
} from '../shared';
import { appReducer } from './app.reducers';
import { matrixReducer } from '../matrix/matrix.reducers';

export const reducers = {
    app: appReducer,
    matrix: matrixReducer,
    streetSettings: streetSettingsReducer,
    thingsFilter: thingsFilterReducer,
    countriesFilter: countriesFilterReducer
};

const productionReducer: ActionReducer<AppStore> = combineReducers(reducers);

export function rootReducer(state: any, action: any) {
    return productionReducer(state, action);
};
