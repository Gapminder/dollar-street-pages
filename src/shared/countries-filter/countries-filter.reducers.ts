import { ActionReducer, Action } from '@ngrx/store';
import { CountriesFilterActions } from './countries-filter.actions';

export function countriesFilterReducer(state: any, action: Action): any {
    switch (action.type) {
        case CountriesFilterActions.GET_COUNTRIES_FILTER_SUCCESS:
            return action.payload;

        default:
            return state;
    }
}
