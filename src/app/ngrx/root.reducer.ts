import { ActionReducerMap } from '@ngrx/store';
import { AppStates } from '../../interfaces';
import { streetSettingsReducer } from '../../common';
import {
    thingsFilterReducer,
    countriesFilterReducer
} from '../../shared';
import { appReducer } from './app.reducers';
import { matrixReducer } from '../../matrix/ngrx/matrix.reducers';
import { languageReducer } from "../../common/language/ngrx/language.reducers";

export const reducers: ActionReducerMap<AppStates> = {
    app: appReducer,
    matrix: matrixReducer,
    streetSettings: streetSettingsReducer,
    thingsFilter: thingsFilterReducer,
    countriesFilter: countriesFilterReducer,
    language: languageReducer,
}
